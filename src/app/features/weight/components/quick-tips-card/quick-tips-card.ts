import { Component, computed } from '@angular/core';

const QUICK_TIPS = [
    'Weigh yourself in the morning, on an empty stomach, before breakfast for the most consistent results.',
    'Daily fluctuations of 1-2kg are totally normal. Focus on the weekly trend instead.',
    'Stay hydrated. Even mild dehydration can make you feel hungrier than you actually are.',
    'Sleep matters just as much as diet. Poor sleep messes with your hunger hormones.',
    "You don't need to weigh in every day. 2-3 times a week is plenty.",
    'Look at how things are trending over weeks, not what one single day says.',
    "Progress isn't always a straight line. Plateaus happen to everyone.",
    'Pay attention to how you feel too, not just the number on the scale.',
    'Small, sustainable changes beat extreme diets in the long run.',
    "Getting stronger or building endurance counts as progress, even if the scale doesn't move.",
];

@Component({
    selector: 'app-quick-tips-card',
    imports: [],
    templateUrl: './quick-tips-card.html',
    styleUrl: './quick-tips-card.css',
})
export class QuickTipsCard {
    quickTips = computed(() => QUICK_TIPS[Math.floor(Math.random() * QUICK_TIPS.length)]);
}
