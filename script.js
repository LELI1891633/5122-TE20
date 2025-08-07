document.querySelector('.search-btn').addEventListener('click', () => {
  alert('Searching for available parking...');
});

document.querySelector('input[type="range"]').addEventListener('input', (e) => {
  console.log("Time selected:", e.target.value);
});

document.querySelectorAll('.demand-buttons button').forEach(btn => {
  btn.addEventListener('click', () => {
    alert(`Selected demand level: ${btn.innerText}`);
  });
});
