document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('urlForm');
    const resultImage = document.getElementById('resultImage');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const personImageUrl = document.getElementById('personImageUrl').value;
            const garmentImageUrl = document.getElementById('garmentImageUrl').value;

            // Validate the person image URL
            if (!personImageUrl) {
                alert('Please provide a valid URL for the person image.');
                return;
            }

            try {
                // Send the data to the backend API
                const response = await fetch('/api/try-on', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        personImageUrl,
                        garmentImageUrl: garmentImageUrl || null, // Send null if no garment URL is provided
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Unknown error occurred.');
                }

                const result = await response.json();

                // Update the result image
                if (result.tryOnImageUrl) {
                    resultImage.src = result.tryOnImageUrl;
                } else {
                    alert('Try-On failed. Please check the provided URLs.');
                }
            } catch (error) {
                console.error('Error:', error.message);
                alert(`An error occurred: ${error.message}`);
            }
        });
    } else {
        console.error('Form with id "urlForm" not found');
    }
});
