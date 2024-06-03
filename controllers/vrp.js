const express = require('express');
const DeliveryPoint = require('../models/deliveryPoint');
const Truck = require('../models/truck');

const router = express.Router();

const simulatedAnnealing = (deliveryPoints, trucks, coolingRate = 0.99, initialTemperature = 1000) => {
    let currentSolution = generateInitialSolution(deliveryPoints, trucks);
    let bestSolution = currentSolution;
    let temperature = initialTemperature;

    while (temperature > 1) {
        let newSolution = generateNeighborSolution(currentSolution);
        let currentEnergy = calculateTotalDistance(currentSolution);
        let neighborEnergy = calculateTotalDistance(newSolution);
        let acceptanceProbability = Math.exp((currentEnergy - neighborEnergy) / temperature);

        if (neighborEnergy < currentEnergy || Math.random() < acceptanceProbability) {
            currentSolution = newSolution;
        }

        if (calculateTotalDistance(currentSolution) < calculateTotalDistance(bestSolution)) {
            bestSolution = currentSolution;
        }

        temperature *= coolingRate;
    }

    return bestSolution;
};

const generateInitialSolution = (deliveryPoints, trucks) => {
    let solution = trucks.map(truck => ({
        truckId: truck.id,
        route: [],
        load: 0
    }));

    deliveryPoints.forEach(point => {
        for (let truck of solution) {
            if (truck.load + point.demand <= truck.capacity) {
                truck.route.push(point);
                truck.load += point.demand;
                break;
            }
        }
    });

    return solution;
};

const generateNeighborSolution = (currentSolution) => {
    let newSolution = JSON.parse(JSON.stringify(currentSolution));
    let truck1Idx = Math.floor(Math.random() * newSolution.length);
    let truck2Idx = (truck1Idx + Math.floor(Math.random() * (newSolution.length - 1)) + 1) % newSolution.length;

    if (newSolution[truck1Idx].route.length > 0 && newSolution[truck2Idx].route.length > 0) {
        let point1Idx = Math.floor(Math.random() * newSolution[truck1Idx].route.length);
        let point2Idx = Math.floor(Math.random() * newSolution[truck2Idx].route.length);

        let point1 = newSolution[truck1Idx].route[point1Idx];
        let point2 = newSolution[truck2Idx].route[point2Idx];

        if (newSolution[truck1Idx].load - point1.demand + point2.demand <= newSolution[truck1Idx].capacity &&
            newSolution[truck2Idx].load - point2.demand + point1.demand <= newSolution[truck2Idx].capacity) {
            newSolution[truck1Idx].route[point1Idx] = point2;
            newSolution[truck2Idx].route[point2Idx] = point1;

            newSolution[truck1Idx].load = newSolution[truck1Idx].load - point1.demand + point2.demand;
            newSolution[truck2Idx].load = newSolution[truck2Idx].load - point2.demand + point1.demand;
        }
    }

    return newSolution;
};

const calculateTotalDistance = (solution) => {
    const euclideanDistance = (point1, point2) => {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    };

    const depot = { x: 0, y: 0 };

    let totalDistance = 0;

    solution.forEach(truck => {
        let route = truck.route;
        if (route.length > 0) {
            totalDistance += euclideanDistance(depot, route[0]);
            for (let i = 0; i < route.length - 1; i++) {
                totalDistance += euclideanDistance(route[i], route[i + 1]);
            }
            totalDistance += euclideanDistance(route[route.length - 1], depot);
        }
    });

    return totalDistance;
};


router.get('/optimize', async (req, res) => {
    try {
        const deliveryPoints = await DeliveryPoint.findAll();
        const trucks = await Truck.findAll();
        const optimalSolution = simulatedAnnealing(deliveryPoints, trucks);

        res.json(optimalSolution);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
