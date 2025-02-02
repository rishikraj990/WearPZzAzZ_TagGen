let currentSectionIndex = 0;
let sections = [];
let selectedItems = new Set();

async function loadYAML() {
    const response = await fetch('Resource/products.yaml');
    const yamlText = await response.text();
    const data = jsyaml.load(yamlText);
    sections = data.sections;
    renderSection(currentSectionIndex);
}

function renderSection(index) {
    const container = document.getElementById('formContainer');
    container.innerHTML = '';
    const section = sections[index];

    if (shouldDisplaySection(section)) {
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        cardHeader.textContent = section.name;
        container.appendChild(cardHeader);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        section.items.forEach(item => {
            const formCheck = document.createElement('div');
            formCheck.className = 'form-check';

            const input = document.createElement('input');
            input.className = 'form-check-input';
            input.type = 'checkbox';
            input.value = item.tagName;
            input.id = item.tagName;
            input.checked = selectedItems.has(item.itemName);
            input.onclick = () => toggleSelection(item.itemName);

            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = item.tagName;
            label.textContent = item.itemName;

            formCheck.appendChild(input);
            formCheck.appendChild(label);
            cardBody.appendChild(formCheck);
        });

        container.appendChild(cardBody);
    } else {
        nextSection();
    }
}

function shouldDisplaySection(section) {
    if (section.isIndependent) return true;
    if (!section.relevantTo) return true;
    return section.relevantTo.some(item => selectedItems.has(item));
}

function toggleSelection(itemName) {
    if (selectedItems.has(itemName)) {
        selectedItems.delete(itemName);
    } else {
        selectedItems.add(itemName);
    }
}

function isPreviousButtonPossible() {
    if (currentSectionIndex > 0) {
        return true;
    }
    return false;
}

function isNextButtonPossible() {
    if (currentSectionIndex < sections.length - 1) {
        return true;
    }
    return false;
}

function submitSelection() {
    const selectedTags = Array.from(selectedItems).map(item => {
        const section = sections.find(sec => sec.items.some(it => it.itemName === item));
        return section ? section.items.find(it => it.itemName === item).tagName : '';
    }).filter(tag => tag !== '');

    document.getElementById('selectedTags').textContent = selectedTags.join(', ');
}

function copyTags() {
    const tags = document.getElementById('selectedTags').textContent;
    navigator.clipboard.writeText(tags).then(() => alert('Tags copied to clipboard!'));
}

window.onload = loadYAML;

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateNavigationButtons() {
    if (currentSectionIndex === 0) {
        prevBtn.classList.add('d-none');
    } else {
        prevBtn.classList.remove('d-none');
    }

    if (currentSectionIndex === sections.length - 1) {
        nextBtn.classList.add('d-none');
    } else {
        nextBtn.classList.remove('d-none');
    }
}

function previousSection() {
    if (currentSectionIndex > 0) {
        currentSectionIndex--;
        renderSection(currentSectionIndex);
        updateNavigationButtons();
    }
}

function nextSection() {
    if (currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
        renderSection(currentSectionIndex);
        updateNavigationButtons();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadYAML();
    updateNavigationButtons();
});