let sections = [];
let selectedItems = new Set();
let tag = new Set();
let currentSectionIndex = 0; // Track the current section index
let sectionSelections = []; // Track selected items in each section
let finalTagList = [];

// Load the YAML file and parse the sections
async function loadYAML() {
    const response = await fetch('Resource/products.yaml');
    const yamlText = await response.text();
    const data = jsyaml.load(yamlText);
    sections = data.sections;
    sectionSelections = new Array(sections.length).fill(false); // Track if any section has selection
    renderAllSections(); // Render all sections on load
}

// Render all sections initially, each in its own card
function renderAllSections() {
    const container = document.getElementById('formContainer');
    container.innerHTML = ''; // Clear the container

    // debugger
    // Render each section as a separate card
    sections.forEach((section, index) => {
        renderSection(section, index);
    });

    // debugger
    // // Add Submit button at the end of all sections
    addSubmitButton();

    // debugger
    // Enable/Disable the Submit button based on selection status
    checkSubmitButtonStatus();

    // Expand only the first card automatically
    // expandSection(0);
    
    // Update buttons visibility
    // updateNavigationButtons();
}

// Render a single section inside its own card box
function renderSection(section, index) {
    // debugger
    const container = document.getElementById('formContainer');

    // Create the card for each section
    const sectionCard = document.createElement('div');
    sectionCard.className = 'card mb-3 p-3';

    // Create the card header with a button for collapsing/expanding the card
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header d-flex justify-content-between align-items-center';
    cardHeader.textContent = section.name;

    const toggleButton = document.createElement('button');
    toggleButton.className = 'btn btn-link';
    toggleButton.textContent = 'Collapse/Expand';
    toggleButton.onclick = () => toggleCollapse(index);

    cardHeader.appendChild(toggleButton);
    sectionCard.appendChild(cardHeader);

    // Create the card body with checkboxes
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.id = `section-body-${index}`;  // Set an ID for the body to handle collapse
    cardBody.style.display = 'none'; // Only the first section is expanded by default

    

    // debugger
    section.items.forEach(item => {
        // debugger
        const formCheck = document.createElement('div');
        formCheck.className = 'form-check';

        const input = document.createElement('input');
        input.className = 'form-check-input';
        input.type = 'checkbox';
        input.value = item.tagName;
        input.id = item.tagName;
        input.checked = selectedItems.has(item.itemName);
        input.onclick = () => handleCheckboxChange(item.itemName, item.tagName, index);

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = item.tagName;
        label.textContent = item.itemName;

        formCheck.appendChild(input);
        formCheck.appendChild(label);
        cardBody.appendChild(formCheck);
    });
    // debugger

    sectionCard.appendChild(cardBody);

    // Create navigation buttons (Previous, Next) for each card
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer d-flex justify-content-between';

    const prevButton = document.createElement('button');
    prevButton.className = 'btn btn-primary';
    prevButton.textContent = 'Previous';
    prevButton.onclick = () => navigateToSection(index, index - 1);
    prevButton.style.display = index === 0 ? 'none' : 'inline-block'; // Hide if it's the first section

    const nextButton = document.createElement('button');
    nextButton.className = 'btn btn-primary';
    nextButton.textContent = 'Next';
    nextButton.onclick = () => navigateToSection(index, index + 1);
    nextButton.style.display = index === sections.length - 1 ? 'none' : 'inline-block'; // Hide if it's the last section

    cardFooter.appendChild(prevButton);
    cardFooter.appendChild(nextButton);

    sectionCard.appendChild(cardFooter);

    container.appendChild(sectionCard);
    if (currentSectionIndex === index) {
        expandSection(currentSectionIndex);
    }
}

// Handle checkbox changes
function handleCheckboxChange(itemName, tagName, sectionIndex) {
    // Toggle item selection
    debugger
    if (selectedItems.has(itemName)) {
        selectedItems.delete(itemName);
        tag.delete(tagName);
    } else {
        selectedItems.add(itemName);
        tag.add(tagName);
    }

    // Mark section as selected if any checkbox is selected
    sectionSelections[sectionIndex] = Array.from(document.querySelectorAll(`#section-body-${sectionIndex} input:checked`)).length > 0;

    // Check the status of the Submit button after each change
    checkSubmitButtonStatus();

    // Re-render the sections based on new selections
    renderAllSections();
}

// Check if Submit button should be enabled or not
function checkSubmitButtonStatus() {
    const submitBtn = document.getElementById('submitBtn');
    // If all sections have at least one selected checkbox, enable Submit
    const allSectionsSelected = sectionSelections.every(selected => selected);
    submitBtn.disabled = !allSectionsSelected;
}

// Submit function (collect selected items)
function submitSelection() {
    finalTagList = [];
    finalTagList = Array.from(tag).join(', ');
    document.getElementById('selectedTags').textContent = `Selected Tags: ${finalTagList}`;

    // Show the "Copy Tags" button
    document.getElementById('copyTagsBtn').classList.remove('d-none');
}

// Copy selected tags to clipboard
function copyTags() {
    navigator.clipboard.writeText(finalTagList)
        .then(() => {
            alert('Tags copied to clipboard!');
        })
        .catch(err => {
            alert('Error copying tags to clipboard: ' + err);
        });
}

// Expand a specific section
function expandSection(index) {
    const body = document.getElementById(`section-body-${index}`);
    body.style.display = 'block'; // Make the body visible
}

// Collapse a specific section
function collapseSection(index) {
    debugger
    const body = document.getElementById(`section-body-${index}`);
    body.style.display = 'none'; // Make the body hidden
}

// Navigate to a specific section
function navigateToSection(currentIndex, index) {
    // debugger
    if (index >= 0 && index < sections.length) {
        // Collapse the current section
        collapseSection(currentSectionIndex);

        // Update current section index
        currentSectionIndex = index;

        // Re-render all sections and expand the new section
        renderAllSections();

        // Expand the current section and the adjacent sections
        // expandSection(currentSectionIndex);
        // if (currentSectionIndex + 1 < sections.length) {
        //     expandSection(currentSectionIndex + 1);
        // }
        // if (currentSectionIndex - 1 >= 0) {
        //     expandSection(currentSectionIndex - 1);
        // }
    }
}

// Toggle collapse/expand of a section's body
function toggleCollapse(index) {
    const body = document.getElementById(`section-body-${index}`);
    const isCollapsed = body.style.display === 'none';

    if (isCollapsed) {
        body.style.display = 'block';
    } else {
        body.style.display = 'none';
    }
}

// Update navigation buttons
// function updateNavigationButtons() {
//     // Show / Hide buttons depending on the current section
//     sections.forEach((section, index) => {
//         const sectionCard = document.getElementById('formContainer').children[index];
//         const prevButton = sectionCard.querySelector('.btn-primary:first-child');
//         const nextButton = sectionCard.querySelector('.btn-primary:last-child');

//         // Show / hide previous button
//         prevButton.style.display = index === 0 ? 'none' : 'inline-block';

//         // Show / hide next button
//         nextButton.style.display = index === sections.length - 1 ? 'none' : 'inline-block';
//     });
// }

// Initialize the form when the page is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await loadYAML();
});
