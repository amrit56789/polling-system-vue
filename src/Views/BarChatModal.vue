<template>
    <div v-if="isVisible" class="fixed inset-0 bg-transparent flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="relative bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-6 space-y-4">
            <canvas ref="barChartCanvas" class="h-64 w-full"></canvas>
            <button class="absolute -top-2 right-4 text-gray-700 hover:text-gray-900" @click="closeModal">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
    </template>
    

<script setup>
import {
    ref,
    watch,
    onMounted,
    onUnmounted,
    defineEmits,
    defineProps,
    nextTick
} from 'vue';
import {
    Chart,
    registerables
} from 'chart.js';
Chart.register(...registerables);

const props = defineProps({
    chartData: Object,
    isVisible: Boolean
});
const emits = defineEmits(['close']);
const barChartCanvas = ref(null);
let chartInstance = null;

const initChart = (chartData) => {
    if (!barChartCanvas.value) return;

    const context = barChartCanvas.value.getContext('2d');

    const barColors = [
        'rgba(255, 99, 132, 0.6)', // Red
        'rgba(54, 162, 235, 0.6)', // Blue
        'rgba(255, 206, 86, 0.6)', // Yellow
        'rgba(75, 192, 192, 0.6)', // Green
        'rgba(153, 102, 255, 0.6)', // Purple
        'rgba(255, 159, 64, 0.6)', // Orange
    ];

    const datasets = chartData.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: barColors,
        borderColor: barColors.map(color => color.replace('0.6', '1')),
        borderWidth: 1
    }));

    chartInstance = new Chart(context, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        precision: 0,
                        callback: function (value) {
                            if (value % 1 === 0) {
                                return value;
                            }
                        }
                    }
                }
            }
        }
    });
};

watch([() => props.isVisible, () => props.chartData], () => {
    if (props.isVisible && props.chartData) {
        nextTick(() => {
            if (chartInstance) {
                chartInstance.destroy();
            }
            initChart(props.chartData);
        });
    }
}, {
    immediate: true,
    deep: true
});

onMounted(() => {
    if (props.isVisible && props.chartData) {
        initChart(props.chartData);
    }
});

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.destroy();
    }
});

const closeModal = () => {
    emits('close');
};
</script>
