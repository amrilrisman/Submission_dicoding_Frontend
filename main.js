/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()
const SAVED_EVENT = 'saved-trx';
const STORAGE_KEY = 'TRACKER_IO';
const STORAGE_BALANCE_KEY = 'BALANCE_TRACKER_IO';
const RENDER_EVENT = 'render-trx';

const nameUsername = "Amril Rismanto I (amrilrisman)";


let transactions = [];
let dataBalance = {};
const enumTypeTrx = Object.freeze({
    INCOME: "income",
    EXPENSE: "expense"
});

const initialAmountCard = "Rp 0";

const transactionForm = document.getElementById('transactionForm');
const btnsearchTransactionForm = document.getElementById('searchTransactionForm');
const formSearchTransactiom = document.getElementById('searchTransactionFormTitleInput');
const formPurpose = document.getElementById('transactionFormTitleInput');
const formAmount = document.getElementById('transactionFormAmountInput');
const formType = document.getElementById('transactionFormTypeSelect');
const formDate = document.getElementById('transactionFormDateInput');
const balance = document.querySelector('.tracker-summary__balance-amount');
const summaryIncome = document.querySelector('.tracker-summary__stat-amount--income');
const summaryOutcome = document.querySelector('.tracker-summary__stat-amount--expense');

let isEditBtn = false;
let trxEditId = false;


function randomID() {
    return +new Date();
}

function dataObjectBalance(balance, income, outcome) {
    return {
        balance: balance ?? 0,
        inCome: income ?? 0,
        outCome: outcome ?? 0,
    }
}

function dataObject(purpose, amount, type, date) {
    const id = randomID();

    if (typeof amount != Number) {
        amount = Number(amount);
    }

    return {
        id: id,
        purpose: purpose,
        amount: amount,
        date: date,
        type: type
    }
}


/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM


/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */

const btnCreateTransaction = document.getElementById('transactionForm');
const incomeList = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");

function renderWidgetTransaction(data = transactions) {
    incomeList.innerText = '';
    expenseList.innerText = '';

    for (const item of data) {

        const itemCard = document.createElement('div');
        const itemCardLeft = document.createElement('div');
        const containerAction = document.createElement('div');
        const itemCardRight = document.createElement('div');
        const purpose = document.createElement('h4');
        const amount = document.createElement('h2');
        const type = document.createElement('p');
        const date = document.createElement('p');


        itemCardLeft.classList.add('left');
        itemCardRight.classList.add('right');
        containerAction.classList.add('container-action');
        purpose.innerText = item.purpose;


        type.innerText = item.type;
        type.classList.add("badge-type-trx");

        date.innerText = item.date;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        const switchExpenses = document.createElement('button');
        switchExpenses.classList.add('switch-expenses');
        switchExpenses.setAttribute('hidden', '')
        switchExpenses.innerText = 'Switch Expenses';
        const switchIncome = document.createElement('button');
        switchIncome.classList.add('switch-income');
        switchIncome.setAttribute('hidden', '')
        switchIncome.innerText = 'Switch Income';


        itemCard.setAttribute('data-testid', `${item.type}-${item.id}`);
        containerAction.append(switchExpenses, switchIncome, editButton, deleteButton);
        itemCardRight.append(type, containerAction);
        itemCardLeft.append(amount, purpose, date);
        itemCard.append(itemCardLeft, itemCardRight);

        deleteButton.addEventListener('click', () => {
            removeTrx(item.id);

        })

        editButton.addEventListener('click', () => {
            prepEditTrx(item.id);
        })

        switchExpenses.addEventListener('click', () => {
            switchExpensesTrx(item);
        })

        switchIncome.addEventListener('click', () => {
            switchIncomeTrx(item);
        })

        console.log(item.type);


        if (item.type == enumTypeTrx.INCOME) {
            amount.innerText = `+ ${rupiahFormat(Number(item.amount))}`;
            itemCard.classList.add('card-container-income');
            switchExpenses.removeAttribute('hidden');
            incomeList.append(itemCard);
        } else if (item.type == enumTypeTrx.EXPENSE) {
            amount.innerText = `- ${rupiahFormat(Number(item.amount))}`;
            itemCard.classList.add('card-container-expense');
            switchIncome.removeAttribute('hidden');
            expenseList.append(itemCard);
        } else {
            console.error("Error render widget")
            alert("Something when wrong");
        }
    }
}

function renderSummaryBalance() {
    // update balance & summary
    balance.textContent = rupiahFormat(dataBalance.balance ?? 0);
    summaryIncome.textContent = rupiahFormat(dataBalance.inCome ?? 0);
    summaryOutcome.textContent = rupiahFormat(dataBalance.outCome ?? 0);

}


function updateBalance(amount, type) {
    const amountInput = Number(amount);
    const previousIncome = Number(dataBalance.inCome ?? 0)
    const previousBalance = Number(dataBalance.balance ?? 0);
    const previousOutCome = Number(dataBalance.outCome ?? 0)

    if (type == enumTypeTrx.INCOME) {
        const finalBalance = previousBalance + amountInput;
        const finalInComoe = previousIncome + amountInput;
        dataBalance = dataObjectBalance(finalBalance, finalInComoe, previousOutCome);
    } else if (type == enumTypeTrx.EXPENSE) {
        const finalBalance = previousBalance - amountInput;
        const finalOutcome = previousOutCome - amountInput;
        dataBalance = dataObjectBalance(finalBalance, previousIncome, finalOutcome);
    } else {
        console.error("Error update Balance")
        return alert("Something when wrong");
    }


}

function refundBalance(dataOld, amount, type) {
    const amountInput = Number(amount);
    const previousIncome = Number(dataBalance.inCome ?? 0)
    const previousBalance = Number(dataBalance.balance ?? 0);
    const previousOutCome = Number(dataBalance.outCome ?? 0)
    console.log("show Data lama => ", dataOld);

    if (!Object.values(enumTypeTrx).includes(type)) {
        console.error("Error update Balance")
        return alert("Something when wrong");

    }

    // kondisi untuk refund saja jika data di hapus 
    if (dataOld == null) {
        if (type == enumTypeTrx.INCOME) {
            const finalBalance = previousBalance - amountInput;
            const finalInComoe = previousIncome - amountInput;
            dataBalance = dataObjectBalance(finalBalance, finalInComoe, previousOutCome);
        }

        if (type == enumTypeTrx.EXPENSE) {
            const finalBalance = previousBalance + amountInput;
            const finalOutcome = previousOutCome + amountInput;
            dataBalance = dataObjectBalance(finalBalance, previousIncome, finalOutcome);
        }
        return;
    }
    // EDIT : jika terdapat data lama, rollback dulu balance dan summary dan ubah ke nilai baru.
    if (type == enumTypeTrx.INCOME) {
        const roolbackBalance = previousBalance - dataOld.amount;
        const rollbackIncome = previousIncome - dataOld.amount;

        const finalBalance = roolbackBalance + amountInput;
        const finalInComoe = rollbackIncome + amountInput;

        dataBalance = dataObjectBalance(finalBalance, finalInComoe, previousOutCome);
    } else {
        const roolbackBalance = previousBalance + dataOld.amount;
        const rollbackOutCOme = previousOutCome + dataOld.amount;

        const finalBalance = roolbackBalance - amountInput;
        const finalOutcome = rollbackOutCOme - amountInput;
        console.log("rollback balance - ", roolbackBalance);
        console.log("rollback balance - ", roolbackBalance);
        dataBalance = dataObjectBalance(finalBalance, previousIncome, finalOutcome);
    }

}

function switchBalanceSummary(item) {
    const previousIncome = Number(dataBalance.inCome ?? 0)
    const previousBalance = Number(dataBalance.balance ?? 0);
    const previousOutCome = Number(dataBalance.outCome ?? 0)

    if (item.type == enumTypeTrx.INCOME) {
        const finalBalance = previousBalance - item.amount;
        const finalIncome = previousIncome - item.amount;
        const finalOutCome = previousOutCome - item.amount;

        dataBalance = dataObjectBalance(finalBalance, finalIncome, finalOutCome);
    }
    if (item.type == enumTypeTrx.EXPENSE) {
        const finalBalance = previousBalance + item.amount;
        const finalIncome = previousIncome + item.amount;
        const finalOutCome = previousOutCome + item.amount;

        dataBalance = dataObjectBalance(finalBalance, finalIncome, finalOutCome);
    }

}

function rupiahFormat(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}


/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

function isStorageExist() {
    if (typeof (Storage) == undefined) {
        alert("Device not support service");
        return false;
    }
    return true;
}

function loadDataTrx() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const getBalance = localStorage.getItem(STORAGE_BALANCE_KEY);
    let decodeBalance = JSON.parse(getBalance);
    let decodeJSON = JSON.parse(serializedData);

    transactions = decodeJSON ?? [];
    dataBalance = decodeBalance ?? {};
    renderWidgetTransaction();
    renderSummaryBalance();

    document.dispatchEvent(new Event(RENDER_EVENT));

}

function saveDataTrx() {
    if (isStorageExist) {
        const dataParsed = JSON.stringify(transactions);
        const dataBalanceParsed = JSON.stringify(dataBalance);
        localStorage.setItem(STORAGE_BALANCE_KEY, dataBalanceParsed);
        localStorage.setItem(STORAGE_KEY, dataParsed);
    }
    document.dispatchEvent(new Event(SAVED_EVENT));
}

document.addEventListener('DOMContentLoaded', () => {
    const username = document.querySelector(
        '.tracker-header__greeting strong'
    );

    username.textContent = nameUsername;
    btnCreateTransaction.addEventListener('submit', (e) => {
        e.preventDefault();

        if (formPurpose.value == '') {
            return alert('Purpose cannot be empty!');
        }

        if (formAmount.value < 1) {
            return alert("Amount must be greater 1!");

        }

        console.log("=====>>> ", isEditBtn);

        if (isEditBtn) {
            editTrx();
        } else {
            transactions.push(dataObject(formPurpose.value, formAmount.value, formType.value, formDate.value));
            updateBalance(formAmount.value, formType.value);
            saveDataTrx();
        }
        // Reset Form setiap submit
        transactionForm.reset();


        renderWidgetTransaction();
        renderSummaryBalance();
    })

    if (isStorageExist()) {
        loadDataTrx();
    }
})

function queryTrx(trxId) {
    for (const item of transactions) {
        if (item.id == trxId) {
            return item;
        }

    }
    return false;
}

function removeTrx(trxId) {
    const target = queryTrx(trxId);
    const indexTarget = transactions.indexOf(target);

    if (target == false) return;

    // update balance
    refundBalance(null, target.amount, target.type);


    transactions.splice(indexTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataTrx();
}




/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

function prepEditTrx(trxId) {
    isEditBtn = true;
    const target = queryTrx(trxId);
    // initial value form 
    trxEditId = target.id;
    formAmount.value = target.amount;
    formDate.value = target.date;
    formPurpose.value = target.purpose;
    if (target.type == enumTypeTrx.INCOME) {
        formType.selectedIndex = 0;
    } else {
        formType.selectedIndex = 1;
    }
    formType.disabled = true;
}

function editTrx() {
    const data = queryTrx(trxEditId);
    refundBalance(data, formAmount.value, formType.value)


    data.purpose = formPurpose.value;
    data.amount = formAmount.value;
    data.type = formType.value;
    data.date = formDate.value;
    isEditBtn = false;
    formType.disabled = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataTrx();
}


/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */

document.addEventListener(SAVED_EVENT, () => {
    console.log("Saved Succesfuly");
})

document.addEventListener(RENDER_EVENT, () => {
    renderWidgetTransaction();
    renderSummaryBalance();
})


/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */

function switchExpensesTrx(item) {
    const data = queryTrx(item.id);

    switchBalanceSummary(data);
    data.type = enumTypeTrx.EXPENSE;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataTrx();

}
function switchIncomeTrx(item) {
    const data = queryTrx(item.id);
    switchBalanceSummary(data);
    data.type = enumTypeTrx.INCOME;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataTrx();

}

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */

btnsearchTransactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (formSearchTransactiom.value.trim() === '') {
        renderWidgetTransaction();
    } else {
        searchTransaction(formSearchTransactiom.value);
    }

})

function searchTransaction(keyword) {
    const resultTransaction = transactions.filter((transaction) => {
        return transaction.purpose
            .toLowerCase()
            .includes(keyword.toLowerCase());
    });

    renderWidgetTransaction(resultTransaction);
}