const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// In-memory data store for varnishes
const varnishes = [
    { id: 1, name: 'varnish A', solidContent: 35, density: 1.2, minThickness: 8, maxThickness: 15 },
    { id: 2, name: 'varnish B', solidContent: 40, density: 1.5, minThickness: 10, maxThickness: 20 },
];

// Výpočtová logika
function calculateCoating(params) {
    const { diameter, length, solidContent, density, minThickness, maxThickness, minWeight, maxWeight } = params;

    const area = (Math.PI * diameter * length) + ((Math.PI * Math.pow(diameter, 2)) / 4);

    // Výpočty pro mikrony
    const minDryLayerGFromMicrons = (minThickness * area / 1000000) * density;
    const maxDryLayerGFromMicrons = (maxThickness * area / 1000000) * density;
    const minDryLayerGM2FromMicrons = minDryLayerGFromMicrons / (area / 1000000);
    const maxDryLayerGM2FromMicrons = maxDryLayerGFromMicrons / (area / 1000000);
    const minWetLayerGFromMicrons = minDryLayerGFromMicrons * 100 / solidContent;
    const maxWetLayerGFromMicrons = maxDryLayerGFromMicrons * 100 / solidContent;
    const minWetLayerGM2FromMicrons = minWetLayerGFromMicrons / (area / 1000000);
    const maxWetLayerGM2FromMicrons = maxWetLayerGFromMicrons / (area / 1000000);
    const minWetLayerUmFromMicrons = (minWetLayerGFromMicrons * 1000000) / (density * area);
    const maxWetLayerUmFromMicrons = (maxWetLayerGFromMicrons * 1000000) / (density * area);

    // Výpočty pro gramy
    const minDryLayerUmFromGrams = (minWeight / area * 1000000) / density;
    const maxDryLayerUmFromGrams = (maxWeight / area * 1000000) / density;
    const minDryLayerGFromGrams = minWeight;
    const maxDryLayerGFromGrams = maxWeight;
    const minDryLayerGM2FromGrams = minWeight / (area / 1000000);
    const maxDryLayerGM2FromGrams = maxWeight / (area / 1000000);
    const minWetLayerGFromGrams = minWeight * 100 / solidContent;
    const maxWetLayerGFromGrams = maxWeight * 100 / solidContent;
    const minWetLayerGM2FromGrams = minWetLayerGFromGrams / (area / 1000000);
    const maxWetLayerGM2FromGrams = maxWetLayerGFromGrams / (area / 1000000);
    const minWetLayerUmFromGrams = (minWetLayerGFromGrams * 1000000) / (density * area);
    const maxWetLayerUmFromGrams = (maxWetLayerGFromGrams * 1000000) / (density * area);

    return {
        minDryLayerGFromMicrons,
        maxDryLayerGFromMicrons,
        minDryLayerGM2FromMicrons,
        maxDryLayerGM2FromMicrons,
        minWetLayerGFromMicrons,
        maxWetLayerGFromMicrons,
        minWetLayerGM2FromMicrons,
        maxWetLayerGM2FromMicrons,
        minWetLayerUmFromMicrons,
        maxWetLayerUmFromMicrons,
        minDryLayerUmFromGrams,
        maxDryLayerUmFromGrams,
        minDryLayerGFromGrams,
        maxDryLayerGFromGrams,
        minDryLayerGM2FromGrams,
        maxDryLayerGM2FromGrams,
        minWetLayerGFromGrams,
        maxWetLayerGFromGrams,
        minWetLayerGM2FromGrams,
        maxWetLayerGM2FromGrams,
        minWetLayerUmFromGrams,
        maxWetLayerUmFromGrams
    };
}

app.post('/calculate', (req, res) => {
    const result = calculateCoating(req.body);
    res.json(result);
});

// API endpoints for managing varnishes
app.get('/varnishes', (req, res) => {
    res.json(varnishes);
});

//app.post('/varnishes', (req, res) => {
    //    const newvarnish = { ...req.body, id: varnishes.length + 1 };
    //varnishes.push(newvarnish);
    //res.json(newvarnish);
    //});

app.post('/varnishes', (req, res) => {
    const newVarnish = { 
      ...req.body, 
      id: varnishes.length + 1,
      name: decodeURIComponent(req.body.name)
    };
    varnishes.push(newVarnish);
    res.json(newVarnish);
  });

app.put('/varnishes/:id', (req, res) => {
    const varnishId = parseInt(req.params.id);
    const index = varnishes.findIndex(varnish => varnish.id === varnishId);
    if (index !== -1) {
        varnishes[index] = { ...varnishes[index], ...req.body };
        res.json(varnishes[index]);
    } else {
        res.status(404).send('varnish not found');
    }
});

app.delete('/varnishes/:id', (req, res) => {
    const varnishId = parseInt(req.params.id);
    const index = varnishes.findIndex(varnish => varnish.id === varnishId);
    if (index !== -1) {
        const deletedvarnish = varnishes.splice(index, 1);
        res.json(deletedvarnish);
    } else {
        res.status(404).send('varnish not found');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});