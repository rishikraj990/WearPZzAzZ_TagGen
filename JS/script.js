let currentSection = 1;
const totalSections = 2;

function nextSection() {
    if (currentSection < totalSections) {
        document.getElementById(`section${currentSection}`).style.display = 'none';
        currentSection++;
        document.getElementById(`section${currentSection}`).style.display = 'block';
    }
}

function previousSection() {
    if (currentSection > 1) {
        document.getElementById(`section${currentSection}`).style.display = 'none';
        currentSection--;
        document.getElementById(`section${currentSection}`).style.display = 'block';
    }
}

function submitSelection() {
    const checkboxes = document.querySelectorAll('.form-check-input:checked');
    const selectedTags = Array.from(checkboxes).map(checkbox => checkbox.value);
    document.getElementById('selectedTags').innerText = selectedTags.join(', ');
}

function copyTags() {
    const tags = document.getElementById('selectedTags').innerText;
    if (tags) {
        navigator.clipboard.writeText(tags).then(() => {
            alert('Tags copied to clipboard!');
        });
    } else {
        alert('No tags to copy!');
    }
}

// Initialize visibility
document.getElementById('section2').style.display = 'none';
