# Plan: Angular Vertical Slice Architecture Refactoring

## TL;DR

Refaktorisacija `mixxfit-web` projekta iz trenutne `core/pages/layout/shared` strukture u Vertical Slice Architecture (VSA) gde svaki feature poseduje sve što mu je potrebno: komponente, servise, modele, form factory-je i validatore. Centralni `Factories.ts` se razbija po feature-ima. `UserService` se deli na read-only `UserState` (core) i write operacije (profile feature). Dashboard dobija sopstveni servis za chart podatke umesto da koristi `WorkoutService`/`WeightEntryService`. Sve feature rute prelaze na lazy loading sa `loadComponent`. Usput se ispravljaju otkriveni bugovi i nekonzistentnosti.

---

## Trenutna vs. Ciljna Struktura

**TRENUTNA:**
```
src/app/
├── auth/
├── core/
│   ├── guards/
│   ├── helpers/        ← Factories.ts (monolitan), FormHelpers.ts, Utility.ts
│   ├── interceptors/
│   ├── models/         ← 13 fajlova + 9 User DTOs (mešavina shared i feature-specific)
│   └── services/       ← auth-service, user-service, notification-service
├── layout/
├── pages/
│   ├── dashboard/
│   ├── misc/           ← chart komponente (pogrešna lokacija)
│   ├── nutrition/
│   ├── profile/
│   ├── weight/
│   └── workout/
└── shared/             ← PRAZNO
```

**CILJNA:**
```
src/app/
├── core/
│   ├── guards/                     ← auth-guard.ts, guest-guard.ts (nepromenjeno)
│   ├── interceptors/               ← auth-interceptor.ts, http-error-interceptor.ts (nepromenjeno)
│   ├── models/                     ← SAMO globalni modeli (PagedResult, QueryParams, ValidationError, ModalData, ModalType)
│   ├── state/
│   │   └── user-state.ts           ← NOVO: read-only globalni user state
│   ├── helpers/
│   │   ├── form-helpers.ts         ← preimenovan iz FormHelpers.ts (kebab-case)
│   │   └── utility.ts              ← preimenovan iz Utility.ts (kebab-case)
│   └── services/
│       ├── auth-service.ts         ← ostaje globalan (koriste guards/interceptors)
│       └── notification-service.ts ← ostaje globalan (koristi ceo projekat)
│
├── features/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.ts/html/css/spec.ts
│   │   ├── register/
│   │   │   ├── register.ts/html/css/spec.ts
│   │   ├── auth-layout/
│   │   │   ├── auth-layout.ts/html/css/spec.ts
│   │   └── models/
│   │       ├── login-request.ts
│   │       ├── register-request.ts
│   │       └── auth-response.ts
│   │
│   ├── dashboard/
│   │   ├── dashboard.ts/html/css/spec.ts
│   │   ├── components/
│   │   │   ├── weight-chart/       ← premešten iz misc/
│   │   │   │   ├── weight-chart.ts/html/css
│   │   │   └── workouts-chart/     ← premešten iz misc/
│   │   │       ├── workouts-chart.ts/html/css
│   │   ├── models/
│   │   │   ├── dashboard-dto.ts
│   │   │   ├── weight-chart-dto.ts     ← KOPIJA, ne import iz weight feature-a
│   │   │   └── workouts-per-month-dto.ts  ← KOPIJA, ne import iz workout feature-a
│   │   └── services/
│   │       └── dashboard-service.ts    ← prošireni servis (preuzima chart endpoints)
│   │
│   ├── nutrition/
│   │   ├── calorie-calculator/
│   │   │   ├── calorie-calculator.ts/html/css/spec.ts
│   │   ├── models/
│   │   │   ├── activity-level.ts
│   │   │   ├── calorie-result.ts
│   │   │   ├── set-daily-calories-request.ts
│   │   │   └── unit-system.ts
│   │   ├── helpers/
│   │   │   └── nutrition-factories.ts  ← createCalculateCaloriesForm()
│   │   └── services/
│   │       └── nutrition-service.ts
│   │
│   ├── profile/
│   │   ├── profile-page/
│   │   │   ├── profile-page.ts/html/css/spec.ts
│   │   ├── password-form/
│   │   │   ├── password-form.ts/html/css/spec.ts
│   │   ├── models/
│   │   │   ├── profile-page-dto.ts
│   │   │   ├── update-date-of-birth-dto.ts
│   │   │   ├── update-email-dto.ts
│   │   │   ├── update-full-name-dto.ts
│   │   │   ├── update-gender-dto.ts
│   │   │   ├── update-height-dto.ts
│   │   │   ├── update-password-dto.ts
│   │   │   ├── update-target-weight-dto.ts
│   │   │   ├── update-user-name-dto.ts
│   │   │   └── update-weight-dto.ts
│   │   ├── helpers/
│   │   │   └── profile-factories.ts    ← 8 form factory funkcija
│   │   └── services/
│   │       └── profile-service.ts      ← prošireni (preuzima update HTTP pozive iz UserService)
│   │
│   ├── weight/
│   │   ├── weight-page/
│   │   │   ├── weight-page.ts/html/css/spec.ts
│   │   ├── models/
│   │   │   ├── weight-chart-dto.ts
│   │   │   ├── weight-create-request-dto.ts
│   │   │   ├── weight-entry-details-dto.ts
│   │   │   ├── weight-list-details-dto.ts
│   │   │   ├── weight-record-dto.ts
│   │   │   └── weight-summary-dto.ts
│   │   ├── helpers/
│   │   │   └── weight-factories.ts     ← createWeightEntryForm(), createTargetWeightForm()
│   │   └── services/
│   │       └── weight-entry-service.ts ← uklanja UserService zavisnost
│   │
│   └── workout/
│       ├── workout-list/
│       │   ├── workout-list.ts/html/css/spec.ts
│       ├── workout-details/
│       │   ├── workout-details.ts/html/css/spec.ts
│       ├── workout-form/
│       │   ├── workout-form.ts/html/css/spec.ts
│       ├── exercise-form/
│       │   ├── exercise-form.ts/html/css/spec.ts
│       ├── models/
│       │   ├── cardio-type.ts
│       │   ├── create-exercise-entry.ts
│       │   ├── create-workout-dto.ts
│       │   ├── exercise-entry.ts
│       │   ├── exercise-entry-form-value.ts
│       │   ├── exercise-type.ts
│       │   ├── set-entry.ts
│       │   ├── workout-details-dto.ts
│       │   ├── workout-list-item-dto.ts
│       │   ├── workout-page-dto.ts
│       │   ├── workout-summary-dto.ts
│       │   └── workouts-per-month-dto.ts
│       ├── helpers/
│       │   └── workout-factories.ts    ← createExerciseForm(), createWorkoutForm(), createWorkoutObject()
│       └── services/
│           └── workout-service.ts      ← uklanja chart metode (Dashboard preuzima)
│
├── layout/
│   ├── app-layout/
│   │   ├── app-layout.ts/html/css/spec.ts
│   ├── components/
│   │   ├── header/
│   │   ├── sidebar/
│   │   ├── bottom-nav/
│   │   └── modal/
│   └── services/
│       └── layout-state.ts
│
├── shared/
│   ├── models/
│   │   ├── gender.ts           ← koriste auth, profile, nutrition, dashboard
│   │   ├── account-status.ts   ← koriste auth i profile
│   │   ├── month.ts
│   │   └── user-details-dto.ts ← DTO koji koristi UserState (centralni korisnički model)
│   └── enums/                  ← (opciono, ako ima više deljenih enum-ova)
│
└── environments/
```

---

## Koraci Refaktorisanja

### Faza 0: Priprema i ispravka bagova (pre refaktorisanja)

1. **Ispraviti `HttpParams` bug** u `weight-entry-service.ts` — `params.set()` mora koristiti reassignment (`params = params.set(...)`) jer je `HttpParams` immutable. Trenutno se `month`, `year`, `targetWeight` parametri tiho gube.

2. **Ukloniti `ɵInternalFormsSharedModule` import** iz `weight-page.ts` — ovo je privatni Angular API. Zameniti sa odgovarajućim Angular forms modulom.

3. **Ukloniti sve `console.log` pozive** iz produkcijskog koda: `AuthService.test()`, `authInterceptor`, `UserService.updateFullName()`, `WorkoutService`, `ExerciseForm.onSubmit()`, `WorkoutDetails`, `Header.getProfileImageSrc()`.

4. **Popraviti gender magic numbers** — u Dashboard i ProfilePage zameniti `=== 1` / `=== 2` sa `Gender.Male` / `Gender.Female` enum vrednostima.

5. **Obrisati neiskorišćene fajlove**: `CalorieCalculatorFormModel.ts`, `Workout.ts` (neiskorišćeni model), `WeightChartDataDto.ts` iz misc/ (duplikat).

---

### Faza 1: Kreiranje core/state i UserState servisa

6. **Kreirati `core/state/` direktorijum** i novi `user-state.ts` servis.

7. **UserState servis** — read-only state store zasnovan na BehaviorSubject/Signal:
   - `userDetails$: Observable<UserDetailsDto | null>` — stream aktuelnih korisničkih podataka
   - `userDetails: Signal<UserDetailsDto | null>` — signal verzija za template-e
   - `setUser(user: UserDetailsDto): void` — poziva se nakon login-a i `getMe()`
   - `patchUser(partial: Partial<UserDetailsDto>): void` — ažurira pojedinačna polja u memoriji (nakon uspešnih PATCH poziva iz ProfileService)
   - `clearUser(): void` — čisti stanje na logout
   - `isLoaded: Signal<boolean>` — da li su podaci učitani
   - `providedIn: 'root'` — globalni servis

8. **Migrirati stanje iz `UserService`** u `UserState`:
   - `UserService.userDetailsSubject` → `UserState.setUser()` / `UserState.patchUser()`
   - `UserService.userDetails$` → `UserState.userDetails$`
   - `UserService.getMe()` metoda ostaje u `AuthService` ili novom core servisu (poziva HTTP i onda `UserState.setUser()`)

---

### Faza 2: Kreiranje features/ direktorijuma i premještanje feature-a

9. **Kreirati `features/` root direktorijum** sa poddirektorijumima za svaki feature.

10. **Premestiti Auth feature:**
    - `auth/` → `features/auth/`
    - Premestiti `LoginRequest`, `RegisterRequest`, `AuthResponse`, `UserDto` iz `core/models/` u `features/auth/models/` (preimenovati u kebab-case)
    - Auth feature NE dobija sopstveni servis — `AuthService` ostaje u `core/services/` jer ga koriste guards i interceptors (infrastrukturna zavisnost)

11. **Premestiti Dashboard feature:**
    - `pages/dashboard/` → `features/dashboard/`
    - `pages/misc/weight-chart/` → `features/dashboard/components/weight-chart/`
    - `pages/misc/workouts-chart/` → `features/dashboard/components/workouts-chart/`
    - Kreirati kopije modela: `WeightChartDto`, `WorkoutsPerMonthDto`, `WeightRecordDto` u `features/dashboard/models/` (VSA princip — svaki slice ima svoje DTO-e)
    - Proširiti `DashboardState` → `DashboardService` sa novim metodama:
      - `getWorkoutChartData(year: number)` — poziva `GET /workouts/workout-chart`
      - `getWeightChartData(targetWeight: number)` — poziva `GET /weight-entries/weight-chart`

12. **Premestiti Workout feature:**
    - `pages/workout/` → `features/workout/`
    - Svi modeli ostaju u `features/workout/models/`
    - Kreirati `features/workout/helpers/workout-factories.ts` sa: `createExerciseForm()`, `createWorkoutForm()`, `createWorkoutObject()`
    - `WorkoutService` — ukloniti `getUserWorkoutCountsByMonth()` i `workoutCounts$` (Dashboard preuzima direktno)

13. **Premestiti Weight feature:**
    - `pages/weight/` → `features/weight/`
    - Kreirati `features/weight/helpers/weight-factories.ts` sa: `createWeightEntryForm()`, `createTargetWeightForm()`, (i `createWeightForm()` ako se koristi)
    - `WeightEntryService` — ukloniti neiskorišćenu `UserService` injection, ukloniti `getMyWeightChart()` i `weightChart$` (Dashboard preuzima)

14. **Premestiti Profile feature:**
    - `pages/profile/` → `features/profile/`
    - Premestiti ALL `Update*Dto` modele iz `core/models/User/` u `features/profile/models/`
    - Premestiti `AccountStatus` u `shared/models/` (koristi se i u auth kontekstu)
    - Kreirati `features/profile/helpers/profile-factories.ts` sa: `createFullNameForm()`, `createDateOfBirthForm()`, `createUsernameForm()`, `createEmailForm()`, `createGenderForm()`, `createHeightForm()`, `createChangePasswordForm()`, `createProfilePictureForm()`
    - **Proširiti `ProfileService`** — preuzima SVE HTTP update metode iz `UserService`:
      - `updateFullName()`, `updateUserName()`, `updateEmail()`, `updateDateOfBirth()`, `updateGender()`, `updateHeight()`, `updateTargetWeight()`, `updateProfilePicture()`, `deleteProfilePicture()`, `deleteAccount()`
      - Svaka metoda nakon uspešnog HTTP response-a poziva `UserState.patchUser()` da sinhronizuje globalno stanje

15. **Premestiti Nutrition feature:**
    - `pages/nutrition/` → `features/nutrition/`
    - Kreirati `features/nutrition/helpers/nutrition-factories.ts` sa: `createCalculateCaloriesForm()`
    - `NutritionService` — zameniti `UserService` zavisnost sa `UserState` (samo čita `userDetails`)

---

### Faza 3: Reorganizacija core/ modela

16. **Premestiti feature-specifične modele** iz `core/models/`:
    - `LoginRequest.ts` → `features/auth/models/login-request.ts`
    - `RegisterRequest.ts` → `features/auth/models/register-request.ts`
    - `AuthResponse.ts` → `features/auth/models/auth-response.ts`
    - `UserDto.ts` → `features/auth/models/user-dto.ts`

17. **Premestiti deljene modele** u `shared/models/`:
    - `UserDetailsDto.ts` → `shared/models/user-details-dto.ts`
    - `Gender.ts` → `shared/models/gender.ts`
    - `AccountStatus.ts` → `shared/models/account-status.ts`
    - `Month.ts` → `shared/models/month.ts`

18. **Zadržati u `core/models/`** (infrastrukturni modeli):
    - `PagedResult.ts` → `core/models/paged-result.ts`
    - `QueryParams.ts` → `core/models/query-params.ts`
    - `ValidationError.ts` → `core/models/validation-error.ts`
    - `ModalData.ts` → `layout/models/modal-data.ts` (koristi ga samo Modal komponenta)
    - `ModalType.ts` → `layout/models/modal-type.ts`

---

### Faza 4: Reorganizacija helpers/

19. **Obrisati centralni `core/helpers/Factories.ts`** nakon što su sve factory funkcije distibuirane po feature-ima (koraci 12-15).

20. **Preimenovati preostale helpere u kebab-case:**
    - `FormHelpers.ts` → `core/helpers/form-helpers.ts`
    - `Utility.ts` → `core/helpers/utility.ts`

---

### Faza 5: Reorganizacija layout/

21. **Premestiti layout utilities** u `layout/components/`:
    - `layout/utilities/header/` → `layout/components/header/`
    - `layout/utilities/sidebar/` → `layout/components/sidebar/`
    - `layout/utilities/bottom-nav/` → `layout/components/bottom-nav/`
    - `layout/utilities/modal/` → `layout/components/modal/`

22. **Premestiti `ModalData` i `ModalType`** u `layout/models/`.

---

### Faza 6: Routing — Lazy Loading

23. **Refaktorisati `app.routes.ts`** da koristi `loadComponent` za sve feature rute:

    ```typescript
    // Authenticated routes (children of AppLayout):
    { path: 'dashboard',    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard) }
    { path: 'workouts',     loadComponent: () => import('./features/workout/workout-list/workout-list').then(m => m.WorkoutList) }
    { path: 'workouts/:id', loadComponent: () => import('./features/workout/workout-details/workout-details').then(m => m.WorkoutDetails) }
    { path: 'workout-form', loadComponent: () => import('./features/workout/workout-form/workout-form').then(m => m.WorkoutForm) }
    { path: 'weight',       loadComponent: () => import('./features/weight/weight-page/weight-page').then(m => m.WeightPage) }
    { path: 'profile',      loadComponent: () => import('./features/profile/profile-page/profile-page').then(m => m.ProfilePage) }

    // Guest routes (children of AuthLayout):
    { path: 'login',    loadComponent: () => import('./features/auth/login/login').then(m => m.Login) }
    { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) }
    ```

24. **Feature-scoped servisi** — za servise koji važe samo za jedan feature, registrovati ih u `providers` niz na ruti umesto `providedIn: 'root'`:
    - `DashboardService` → provider na `/dashboard` ruti
    - `ProfileService` → provider na `/profile` ruti
    - `NutritionService` → provider na nutrition child ruti (CalorieCalculator je deo Dashboard-a, pa razmisliti o scoping-u)
    - `WorkoutService` → provider na workout parent ruti (deli se među workout-list, workout-details, workout-form)
    - `WeightEntryService` → provider na `/weight` ruti

---

### Faza 7: Cleanup UserService

25. **Smanjiti `UserService`** na minimalnu funkcionalnost:
    - Zadržava samo `getMe()` metodu (HTTP GET /users/me)
    - Nakon uspešnog poziva, poziva `UserState.setUser(response)`
    - SVE update metode se prebacuju u `ProfileService`
    - SVE direktne reference na `userDetails$` u komponentama se zamenjuju sa `UserState.userDetails$`
    - Razmotriti preimenovanje u `UserApiService` ili spajanje sa `AuthService` (pošto se `getMe()` poziva samo iz `AppLayout` pri inicijalizaciji)

---

### Faza 8: Ažuriranje import putanja

26. **Ažurirati SVE import putanje** u celom projektu. Ovo je najobimniji korak. Fajlovi koji zahtevaju promenu importa:
    - Svaka komponenta koja importuje modele iz `core/models/`
    - Svaka komponenta koja importuje factory funkcije iz `core/helpers/Factories`
    - Svaka komponenta koja koristi `UserService.userDetails$` → `UserState.userDetails$`
    - Dashboard komponenta — potpuna zamena injektovanih servisa
    - ProfilePage — zamena `UserService` update metoda sa `ProfileService`
    - Sve rute u `app.routes.ts`

27. **Kreirati barrel exports (index.ts)** za svaki feature za čistije importovanje:
    - `features/workout/models/index.ts` — re-exportuje sve modele
    - `features/dashboard/services/index.ts` — exportuje DashboardService
    - itd.

---

### Faza 9: Finalne provere i čišćenje

28. **Obrisati prazne direktorijume**: `pages/`, `pages/misc/`, stari `core/models/User/`

29. **Ukloniti nekonzistentnosti u naming-u:**
    - `DashboardState` → `DashboardService` (konzistentnost sa ostalim servisima)
    - `LayoutState` ostaje (jer je state management, ne HTTP servis)
    - `UpdatePasswordDto` — promeniti `interface` u `type` (konzistentnost)
    - Ukloniti eksplicitni `standalone: true` iz `WorkoutDetails` (Angular 21 default)

30. **Koristiti `Month` enum** u WeightPage umesto hardkodiranog `convertMonthNumberToString()`.

---

## Arhitektura Feature Servisa u VSA

### Feature-specifični servisi (važe SAMO za taj feature)

| Servis | Feature | Scoping | Opis |
|--------|---------|---------|------|
| `DashboardService` | dashboard | route-scoped | Sav data fetching za dashboard (summary + charts) |
| `WorkoutService` | workout | route-scoped | CRUD workouts + pagination |
| `WeightEntryService` | weight | route-scoped | CRUD weight entries + summary |
| `ProfileService` | profile | route-scoped | GET profile + SVE user update HTTP pozivi |
| `NutritionService` | nutrition | route-scoped* | Calorie calculation + daily calorie goal |

*NutritionService se koristi iz CalorieCalculator koji je child komponenta Dashboard-a, pa može biti `providedIn: 'root'` ili provider na Dashboard ruti.

### Deljeni servisi (cross-feature, `providedIn: 'root'`)

| Servis | Lokacija | Razlog deljenja |
|--------|----------|-----------------|
| `AuthService` | core/services/ | Guards, interceptors, auth flow |
| `NotificationService` | core/services/ | Koriste sve komponente |
| `UserState` | core/state/ | Globalno korisničko stanje — čitaju ga Dashboard, WeightPage, ExerciseForm, ProfilePage, AppLayout, NutritionService |
| `LayoutState` | layout/services/ | Header title management — čitaju ga svi page komponenti |

### Pravilo za budući razvoj

Ako novi servis opslužuje SAMO jednu feature → stavlja se u `features/{feature}/services/` sa route-scoped providerom. Ako ga koriste 2+ feature-a → ide u `core/services/` ili `core/state/` sa `providedIn: 'root'`.

---

## UserState Servis — Detaljan Dizajn

```
Lokacija: core/state/user-state.ts
Scope: providedIn: 'root'

Stanje:
  - private userDetailsSubject = BehaviorSubject<UserDetailsDto | null>(null)
  - userDetails$ = userDetailsSubject.asObservable()
  - userDetails = toSignal(userDetails$)
  - isLoaded = computed(() => userDetails() !== null)

Metode:
  - setUser(user: UserDetailsDto): void
      → userDetailsSubject.next(user)
      → poziva se iz AuthService (nakon login/register) i iz getMe() poziva

  - patchUser(partial: Partial<UserDetailsDto>): void
      → mergeuje partial sa trenutnim stanjem
      → userDetailsSubject.next({ ...current, ...partial })
      → poziva se iz ProfileService nakon svakog uspešnog PATCH HTTP poziva

  - clearUser(): void
      → userDetailsSubject.next(null)
      → poziva se iz AuthService.logout()

  - getImageUrl(): Signal<string>
      → computed signal koji vraća pun URL korisničke slike
```

---

## Cross-Feature Dependency Map (za referencu)

### Dashboard cross-feature zavisnosti (ELIMINIŠU SE)

| Trenutna zavisnost | Rešenje |
|--------------------|---------|
| `WorkoutService.getUserWorkoutCountsByMonth()` | `DashboardService.getWorkoutChartData()` — sopstveni HTTP poziv |
| `WorkoutService.workoutCounts$` | `DashboardService.workoutCounts$` |
| `WeightEntryService.getMyWeightChart()` | `DashboardService.getWeightChartData()` — sopstveni HTTP poziv |
| `WeightEntryService.weightChart$` | `DashboardService.weightChart$` |
| `UserService.userDetails$` | `UserState.userDetails$` (dozvoljeno — UserState je globalni state) |
| `misc/weight-chart` component | Premešten u `features/dashboard/components/` |
| `misc/workouts-chart` component | Premešten u `features/dashboard/components/` |
| `nutrition/calorie-calculator` component | Premešten u `features/nutrition/` — Dashboard ga importuje (dozvoljeno — lazy sub-component) |

### Factory funkcije — distribucija po feature-ima

| Izvor | Destinacija | Funkcije |
|-------|-------------|----------|
| `core/helpers/Factories.ts` | `features/workout/helpers/workout-factories.ts` | `createExerciseForm`, `createWorkoutForm`, `createWorkoutObject` |
| `core/helpers/Factories.ts` | `features/profile/helpers/profile-factories.ts` | `createFullNameForm`, `createDateOfBirthForm`, `createUsernameForm`, `createEmailForm`, `createGenderForm`, `createHeightForm`, `createChangePasswordForm`, `createProfilePictureForm` |
| `core/helpers/Factories.ts` | `features/weight/helpers/weight-factories.ts` | `createWeightEntryForm`, `createTargetWeightForm`, `createWeightForm` |
| `core/helpers/Factories.ts` | `features/nutrition/helpers/nutrition-factories.ts` | `createCalculateCaloriesForm` |

---

## Otkriveni Bugovi i Problemi

| # | Problem | Lokacija | Prioritet |
|---|---------|----------|-----------|
| 1 | `HttpParams` immutability bug — `params.set()` bez reassignment-a | `weight-entry-service.ts` | **KRITIČAN** |
| 2 | `ɵInternalFormsSharedModule` — privatni Angular API | `weight-page.ts` | VISOK |
| 3 | `console.log` u produkcijskom kodu | 7 fajlova | SREDNJI |
| 4 | Gender magic numbers (`=== 1` umesto `Gender.Male`) | Dashboard, ProfilePage | NIZAK |
| 5 | Neiskorišćeni fajlovi/modeli | 3 fajla | NIZAK |
| 6 | `Login` — `destroy$` Subject bez `OnDestroy` | login.ts | NIZAK |
| 7 | Naming nekonzistentnosti (PascalCase helperi, mešavina interface/type) | Više fajlova | NIZAK |

---

## Verifikacija

1. **Kompilacija** — `ng build` bez grešaka nakon svakog koraka faze
2. **Postojeći testovi** — `ng test` prolazi (ažurirati import putanje u spec fajlovima)
3. **Funkcionalni test** — manuelna provera svakog feature-a:
   - Login/Register flow
   - Dashboard sa chart podacima
   - Workout CRUD + paginacija
   - Weight entry CRUD + summary
   - Profile update svih polja + slika
   - Calorie calculator
   - Logout + token rotation
4. **Lazy loading provera** — Chrome DevTools Network tab → svaka ruta učitava svoj chunk
5. **Route-scoped servisi** — proveriti da servisi nemaju `providedIn: 'root'`, da se instanciraju samo na svojoj ruti
6. **No circular dependencies** — `ng build` sa `--source-map` i analiza dependency graph-a

---

## Odluke

- **Dashboard izolacija:** Dashboard dobija sopstvene kopije DTO-ova (`WeightChartDto`, `WorkoutsPerMonthDto`) i sopstveni servis za chart endpointe, umesto cross-feature importa — poravnanje sa backend VSA gde se DTO-ovi dupliraju po slice-ovima
- **UserState vs UserService:** `UserState` je čist state container (BehaviorSubject + signals), `ProfileService` preuzima HTTP write operacije, `getMe()` ostaje u core (poziva se iz AppLayout init-a)
- **Factories decomposition:** Svaki feature dobija svoj `{feature}-factories.ts` u `helpers/` poddirektorijumu — eliminše centralni god-fajl
- **Auth servis ostaje u core:** Iako je "feature", `AuthService` je infrastrukturna zavisnost (guards, interceptors) i ne može biti route-scoped
- **Lazy loading sve rute:** Svi feature-i koriste `loadComponent` za optimalan bundle splitting i route-scoped DI
