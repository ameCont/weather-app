const API_KEY = 'DEMO_KEY'
const API_URL = `https://api.nasa.gov/insight_weather/?
api_key=${API_KEY}&feedtype=json&ver=1.0`

// Where the cool stuff happens

//Change this if you need to
const previousWeatherToggle = document.querySelector('.show-previous-weather');
const previousWeather = document.querySelector('.previous-weather')
const currentSolElement = document.querySelector('[data-current-sol')
const currentDateElement = document.querySelector('[data-current-date')
const currentTempHighElement = document.querySelector('[data-current-temp-high')
const currentTempLowElement = document.querySelector('[data-current-temp-low')
const currentWindSpeedElement = document.querySelector('[data-current-wind-speed')
const windDirectionText = document.querySelector('[data-wind-direction-text')
const windDirectionArrow = document.querySelector('[data-wind-direction-arrow')

const previousSolTemplate = document.querySelector('[data-previous-sol-template')
const previousSolContainer= document.querySelector('[data-previous-sols')

const unitToggle = document.querySelector(['data-unit-toggle'])
const metricRadio = document.getElementById(['cel'])
const imperialRadio = document.getElementById(['fah'])

previousWeatherToggle.addEventListener('click', () => {
    previousWeather.classList.toggle('show-weather')
})

let selectedSolIndex

getWeather().then(sols => {
    selectedSolIndex = sols.length - 1
    displaySelectedSol(sols)
    displayPreviousSols(sols)
    updateUnits()

    unitToggle.addEventListener('click', () => {
        let metricUnits = !isMetric()
        metricRadio.checked = metricUnits
        imperialRadio.checked = !metricUnits
        updateUnits()
    })

    metricRadio.addEventListener('change', () => {
        updateUnits()
    })

    imperialRadio.addEventListener('change', () => {
        updateUnits()
    })
})

function displaySelectedSol(sols) {
    const selectedSol = sols[selectedSolIndex]
    currentSolElement.innerText = selectedSol.sol
    currentDateElement.innerText = displayDate(selectedSol.date)
    currentTempHighElement.innerText = selectedSol.maxTemp
    currentTempLowElement.innerText = selectedSol.minTemp
    windSpeedElement.innerText = selectedSol.windSpeed
    windDirectionArrow.style.setProperty('--direction',
    `${selectedSol.windDirectionDegrees}deg`)
    windDirectionText=innerText = 
    selectedSol.windDirectionCardinal
}

function displayPreviousSols(sols) {
    previousSolContainer.innerText= ''
    sols.forEach((solDate, index) => {
        const solContainer = previousSolTemplate.textContent.cloneNode(true)
        solContainer.querySelector('[data-sol]').innerText = solData.sol
        solContainer.querySelector(['data-date']).innerText = displayDate(solData.date)
        solContainer.querySelector('[data-temp-high').innerText = displayTemperature(solData.maxTemp)
        solContainer.querySelector('[data-temp-low').innerText = displayTemperature(solData.minTemp)
        solContainer.querySelector('[data-select-button').addEventListener('click'.() => {
            selectedSolIndex = index
            displaySelectedSol(sols)
        })
        previousSolContainer.appendChild(solContainer)
    })
}


function displayDate(date) {
    return date.toLocaleDateString(
        undefined,
        { day: 'numeric', month: 'long'}
    )
}

function displayTemperature(temperature) {
    let returnTemp = temperature
    if (!isMetric()) {
        returnTemp = (temperature - 32) * (5 / 9)
    }

    return Math.round(returnTemp)
}

function displaySpeed(speed) {
    let returnSpeed = speed
    if (!isMetric()) {
        returnSpeed = speed / 1.609
    }
    return Math.round(returnSpeed)
}

function getWeather(){
    fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        const {
            sol_keys,
            validity_checks,
            ...solData
        } = data
        return Object.entries(solData).map(([sol, data]) => {
            return {
                sol: sol,
                maxTemp: data.AT.mx,
                minTemp: data.AT.mn,
                windSpeed: data.HWS.av,
                windDirectionDegrees:
                data.WD.most_common.compass_degrees,
                windDirectionCardinal:
                data.WD.most_common.compass_point,
                date: new Date(data.First_UTC)
            }
        })

    })
}

function updateUnits() {
    const speedUnits = document.querySelectorAll('[data-speed-unit]')
    const tempUnits = document.querySelectorAll('[data-temp-unit')
    speedUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'kph' : 'mph'
    })
    tempUnits.forEach(unit => {
        unit.innerText = isMetric() ? 'C' : 'F'
    })
}

function isMetric() {
    return metricRadio.checked
}