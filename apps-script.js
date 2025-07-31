/**
 * @OnlyCurrentDoc
 * This script automatically merges cells for a single transaction when data is added.
 * It uses a lock to prevent race conditions from multiple simultaneous edits.
 * This script is designed to be pasted into the Google Apps Script editor
 * associated with your Google Sheet.
 */
function onEdit(e) {
  // If the script is run manually from the editor, the event object 'e' will not exist.
  // This check prevents an error in that case.
  if (!e) {
    console.log("onEdit function was run manually, not from a sheet edit. Exiting.");
    return;
  }

  // Get the specific sheet (tab) that was edited.
  const sheet = e.source.getActiveSheet();

  // We only want this script to run on our main "Receipt" sheet.
  // This prevents it from running on the "Dashboard" or other sheets.
  if (sheet.getName() !== "Receipt") {
    return;
  }

  // Get the Transaction ID from the first new row that was edited.
  // Column B is the second column.
  const editedRange = e.range;
  const firstEditedRow = editedRange.getRow();
  const transactionId = sheet.getRange(firstEditedRow, 2).getValue(); 

  // If there's no transaction ID in the edited row, it's not a new entry, so we stop.
  if (transactionId === "") {
    return;
  }

  // Use a lock to ensure only one instance of the script runs for a transaction at a time.
  // This is crucial because the web app might write multiple rows very quickly,
  // triggering this onEdit function multiple times.
  const lock = LockService.getScriptLock();
  // Wait up to 10 seconds for the lock. If another process has the lock, this execution will stop.
  if (!lock.tryLock(10000)) {
    console.log("Could not obtain lock. Another process is likely running for this transaction.");
    return;
  }
  
  try {
    // IMPORTANT: Pause for 3 seconds. This gives the web app enough time to write all 
    // the item rows for a single receipt before we try to merge them.
    Utilities.sleep(3000); 

    // Get all transaction IDs from column B to find the full range for our current transaction.
    const data = sheet.getRange("B:B").getValues();
    let startRow = -1;
    let endRow = -1;

    // Loop through all rows to find where our current transaction starts and ends.
    for (let i = 1; i < data.length; i++) { // Start from row 2 (index 1) to skip the header
      if (data[i][0] === transactionId) {
        if (startRow === -1) {
          startRow = i + 1; // Sheet rows are 1-indexed, so we add 1.
        }
        endRow = i + 1;
      }
    }

    // Proceed only if we found a transaction that spans more than one row.
    if (startRow !== -1 && endRow > startRow) {
      console.log(`Processing transaction ${transactionId} from row ${startRow} to ${endRow}`);
      
      // These are the column numbers we want to merge vertically.
      // A=1, B=2, C=3, D=4, E=5, F=6, J=10, K=11, L=12
      const columnsToMerge = [1, 2, 3, 4, 5, 6, 10, 11, 12];
      
      columnsToMerge.forEach(colIndex => {
        const rangeToMerge = sheet.getRange(startRow, colIndex, endRow - startRow + 1, 1);
        // The breakApart() command is important. It un-merges the cells first, which prevents
        // errors if the script accidentally runs on already-merged cells. Then it merges them.
        rangeToMerge.breakApart().mergeVertically();
      });
    }
  } catch (err) {
      console.error("An error occurred during merging: " + err.toString());
  } finally {
    // ALWAYS release the lock at the end, so the script can run for the next edit.
    lock.releaseLock();
  }
}
