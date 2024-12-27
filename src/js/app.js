// DOM Elements
const memoryList = document.getElementById('memoryList');
const processSizeInput = document.getElementById('processSizeInput');
const firstFitBtn = document.getElementById('firstFitBtn');
const worstFitBtn = document.getElementById('worstFitBtn');
const logText = document.getElementById('logText'); 
const editModal = document.getElementById('editModal');
const editBlockSize = document.getElementById('editBlockSize');
const editSaveBtn = document.getElementById('editSaveBtn');
const editCancelBtn = document.getElementById('editCancelBtn');
const resetLogBtn = document.getElementById('resetLogBtn');

// Determine which page we're on
const isFirstFitPage = document.title.includes('First Fit');

// Memory state - initialized with size 0
let memoryBlocks = [
  { size: 0, remaining: 0, occupied: false },
  { size: 0, remaining: 0, occupied: false }, 
  { size: 0, remaining: 0, occupied: false },
  { size: 0, remaining: 0, occupied: false },
  { size: 0, remaining: 0, occupied: false },
  { size: 0, remaining: 0, occupied: false },
  { size: 0, remaining: 0, occupied: false }
];

let currentEditBlock = null;

// First Fit Algorithm
function firstFit(processSize) {
  for (let i = 0; i < memoryBlocks.length; i++) {
    const block = memoryBlocks[i];
    if (block.size > 0 && block.remaining >= processSize && !block.occupied) {
      return i;
    }
  }
  return -1;
}

// Worst Fit Algorithm
function worstFit(processSize) {
  let worstFitIndex = -1;
  let largestRemainingSize = -1;

  for (let i = 0; i < memoryBlocks.length; i++) {
    const block = memoryBlocks[i];
    if (block.size > 0 && block.remaining >= processSize && !block.occupied) {
      if (block.remaining > largestRemainingSize) {
        largestRemainingSize = block.remaining;
        worstFitIndex = i;
      }
    }
  }
  return worstFitIndex;
}

// UI Updates
function updateMemoryList() {
  const tbody = memoryList.querySelector('tbody');
  tbody.innerHTML = '';

  memoryBlocks.forEach((block, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border-2 border-black p-2 text-center">${index + 1}</td>
      <td class="border-2 border-black p-2 text-center">${block.size}</td>
      <td class="border-2 border-black p-2 text-center">${block.remaining}</td>
      <td class="border-2 border-black p-2 text-center">
        <button onclick="editBlock(${index})" class="w-32 px-4 py-2 bg-pink-400 neo-button font-bold">
          Edit Block
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function logAllocation(allocationType, processSize, result, remainingSize = null) {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] ${allocationType} Allocation:\n` +
    `Process Size: ${processSize}\n` +
    `Result: ${result}\n` +
    (remainingSize !== null ? `Remaining Size: ${remainingSize}\n` : '') +
    '-'.repeat(40) + '\n\n';

  logText.innerHTML = logEntry + logText.innerHTML;
}

// Event Handlers
function editBlock(index) {
  currentEditBlock = index;
  editBlockSize.value = memoryBlocks[index].size;
  editModal.classList.remove('hidden');
}

function handleAllocation(algorithm) {
  const processSize = parseInt(processSizeInput.value);
  if (!processSize || processSize <= 0) {
    alert('Please enter a valid process size');
    return;
  }

  const algorithmType = algorithm === 'first' ? 'First Fit' : 'Worst Fit';
  const blockIndex = algorithm === 'first' ? firstFit(processSize) : worstFit(processSize);

  if (blockIndex === -1) {
    logAllocation(algorithmType, processSize, 'No suitable memory block found');
  } else {
    const block = memoryBlocks[blockIndex];
    block.remaining = block.remaining - processSize;
    block.occupied = true;
    logAllocation(algorithmType, processSize,
      `Allocated to memory block ${blockIndex + 1}`, block.remaining);
    updateMemoryList();
  }

  processSizeInput.value = '';
}

// Add event listeners based on the page
if (isFirstFitPage && firstFitBtn) {
  firstFitBtn.addEventListener('click', () => handleAllocation('first'));
} else if (!isFirstFitPage && worstFitBtn) {
  worstFitBtn.addEventListener('click', () => handleAllocation('worst'));
}

if (editSaveBtn) {
  editSaveBtn.addEventListener('click', () => {
    const newSize = parseInt(editBlockSize.value);
    if (!newSize || newSize <= 0) {
      alert('Please enter a valid block size');
      return;
    }

    memoryBlocks[currentEditBlock] = {
      size: newSize,
      remaining: newSize,
      occupied: false
    };

    editModal.classList.add('hidden');
    currentEditBlock = null;
    updateMemoryList();
  });
}

if (editCancelBtn) {
  editCancelBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
    currentEditBlock = null;
  });
}

if (resetLogBtn) {
  resetLogBtn.addEventListener('click', () => {
    logText.innerHTML = '';

    memoryBlocks.forEach(block => {
      block.remaining = block.size;
      block.occupied = false;
    });

    updateMemoryList();
  });
}

// Initialize
updateMemoryList();