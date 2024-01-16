/* UTILITIES */



const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const randomId = () => self.crypto.randomUUID()

const showElement = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.remove('hidden')
    }
}

const hideElement = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.add('hidden')
    }
}

const cleanContainer = (selector) => $(selector).innerHTML = ""

const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))


// OPERATIONS

const allOperations = getData("operations") || []
// const allCategories = getData("categories") || data


//  Add New Operation

const getOperationById = (operationId) => getOperations().find(({id}) => id === operationId)


const saveOperation = () => {
    return{
        id: randomId(),
        description: $("#input-description-text").value,
        category: $("#select-category").value,
        day: $("#op-input-date").value,
        amount: $("#input-amount").valueAsNumber,
        type: $("#select-type").value,
    }
}

const showOperations = (arrayOperations) => {
    $(".tbody-info-render").innerHTML = "" 
        if (!(arrayOperations.length > 0)) {
            $(".operaciones-container").classList.remove("hidden");
            $(".operaciones-table-container").classList.add("hidden");
         }

    const categoryName = (idCategory) => {
        for(const category of getData("categories")){
          if(idCategory === category.id){
            return(category.category)
          }
        }
      }

    for (const operation of arrayOperations) {    
        $(".tbody-info-render").innerHTML +=

   `<tr>
        <td class="text-center border-r-6 p-3max-w-[150px]">${operation.description}</td>
        <td class="text-center border-r-6 p-3">
            <p class="bg-slate-300 text-center rounded-md">${categoryName(operation.categoria)}</p>
         </td>
        <td class="text-center border-r-6 p-3">${operation.day}</td>
        <td class="text-center border-r-6 p-3" id="num-amount">${operation.amount}</td>
        <td class="p-3 flex flex-col">
            <button class="bg-slate-300 text-center mb-1 border-r-6 rounded-md" onclick="ejecutionOfNewOp('${operation.id}')">Editar</button>
            <button class="bg-slate-300 text-center border-r-6 rounded-md" onclick="ejecutionDeleteBtn('${operation.id}', '${operation.description}')">Eliminar</button>
        </td>
    </tr>
    <tr class="m-28 border-2 border-slate-300"></tr> 
    `
  }
}
// Renders-Operation

const renderOperations = (operations) => {
    cleanContainer(".tbody-info-render")
    if (operations.length) {
        hideElement([".no-operations"])
        showElement([".operaciones-table-container"])
    for (const operation of operations) {
        $(".tbody-info-render").innerHTML += `
        <tr class="">
            <td class="sm:pr-6 text-left">${operation.description}</td>
            <td class="text-s text-emerald-600 bg-emerald-50 rounded text-left max-md:hidden">${operation.category}</td>
            <td class="sm:pr-6 text-left max-md:hidden">${operation.day}</td>
            <td class="sm:pr-6 text-left">${operation.amount}</td>
            <td>
                <button class="containerEditOperation-btn text-teal-500 hover:text-black" data-id onclick="editForm('${operation.id}')">Editar</i></button>
                <button type="button" class="btn removeOperation-btn text-teal-500 hover:text-black" data-id onclick="ejecutionDeleteBtn('${operation.id}','${operation.description}')" data-bs-toggle="modal" data-bs-target="#delete-modal">Eliminar</i></button>
            </td>
        </tr>
        `
    }
    } else {
        showElement([".no-operations"])
        hideElement([".operaciones-table-container"])
        }
}

// Edit Operation Form

const editForm = (operationId) => {
    hideElement([".operations-main-container", "#btn-add-newOp"])
    showElement([".newOperation-container", ".btn-confirm-edit"])
    $(".btn-confirm-edit").setAttribute("data-id", operationId)
    const operationEdit = getData("operations").find(operation => operation.id === operationId)
    $("#input-description-text").value = operationEdit.description
    $("#select-category").value = operationEdit.category
    $("#op-input-date").value = operationEdit.day
    $("#input-amount").value = operationEdit.amount
    $("#select-type").value = operationEdit.type

}

const clearOperationForm = () => {
    $("#input-description-text").value = ""
    $("#input-amount").value = "0"
    $("#select-type").value = "Gasto"
    $("#op-input-date").valueAsDate = date
}

const getOperationDetails = () => {
    const description = $("#input-description-text").value
    const amount = $("#input-amount").valueAsNumber
    const type = $("#select-type").value
    const category = $("#select-category").value
    const day = $("#op-input-date").valueAsDate
    return { description, amount, type, category, day }
}


const fillOperationForm = (operation) => {
    $("#input-description-text").value = operation.description
    $("#input-amount").value = operation.amount
    $("#select-type").value = operation.type
    $("#select-category").value = operation.category
    $("#op-input-date").valueAsDate = new Date (operation.day)
}


const updateOperation = (operationId) => {
    const updatedOperations = getOperations().map(operation =>
        (operation.id === operationId) ? saveOperation(operationId) : operation
    )
    updateData(null, updatedOperations)
}

const handleEditOperation = () => {
    const operationId = $("#edit-operation").getAttribute("data-id")
    const { description, amount, type, category, day } = getOperationDetails()

    if (description && !isNaN(amount) && type && category && day) {
        updateOperation(operationId)
    } else {
        showElement(["#error-message"])
    }
}

// Delete operation

const ejecutionDeleteBtn = (operationId) => {
    $("#btn-remove-operations").setAttribute("data-id", operationId)
    $("#btn-remove-operations").addEventListener("click", () => {
        const operationId = $("#btn-remove-operations").getAttribute("data-id")
        deleteOperation(operationId);
        showOperations(getData("operations"))
    })
}

const deleteOperation = (operationId) => {
    const currentData = getData("operations").filter(operation => operation.id != operationId);
    setData("operations", currentData);
    window.location.reload()

}

/* EVENTS */

const initializeApp = () => {
    setData("operations", allOperations) 
//     setData("categories", allCategories)
    renderOperations(allOperations) 
//     addNewCategory(allCategories)

// Navigation Buttons - Header buttons

$("#categorias-sheet").addEventListener("click", () => {
    showElement([".categories-container"])
    hideElement([".operations-main-container", ".newOperation-container", ".reports-container"])
})

$("#reportes-sheet").addEventListener("click", () => {
    showElement([".reports-container"])
    hideElement([".operations-main-container", ".categories-container", ".newOperation-container"])
})

$("#balance-sheet").addEventListener("click", () => {
    hideElement([".categories-container", ".newOperation-container", ".reports-container"])
    showElement([".operations-main-container"])
})

// <!-- Dropdown menu -->

$(".menu-hamburgesa").addEventListener("click", () => {
    $(".fa-bars").classList.toggle("hidden")
    $(".fa-xmark").classList.toggle("hidden")
    $(".dropdown-menu").classList.toggle("hidden")
})

$("#categorias-sheet-drop").addEventListener("click", () => {
    showElement([".categories-container"])
    hideElement([".operations-main-container", ".newOperation-container", ".reports-container"])
})

$("#reportes-sheet-drop").addEventListener("click", () => {
    showElement([".reports-container"])
    hideElement([".operations-main-container", ".categories-container", ".newOperation-container"])
})

$("#balance-sheet-drop").addEventListener("click", () => {
    hideElement([".categories-container", ".newOperation-container", ".reports-container"])
    showElement([".operations-main-container"])
})

// <!-- New operation container button-->

$("#btn-nuevaOperacion").addEventListener("click", () => {
    showElement([".newOperation-container", "#btn-add-newOp"])
    hideElement([".operations-main-container", ".btn-confirm-edit"])
})

$("#btn-cancel-newOp").addEventListener("click", () => {
    hideElement([".newOperation-container"])
    showElement([".operations-main-container"])
})

// Add Operation

$("#btn-add-newOp").addEventListener("click", (e) => {
    e.preventDefault()
    const currentData = getData("operations")
    currentData.push(saveOperation())
    setData("operations", currentData)
    hideElement([".newOperation-container"])
    showElement([".operations-main-container"])
    window.location.reload()
})

// Edit Operation 
$(".btn-confirm-edit").addEventListener("click", (e) => {
        e.preventDefault()
        const operationId = $(".btn-confirm-edit").getAttribute("data-id")
        const currentData = getData("operations").map( operation => {
            if(operation.id === operationId) {
                return saveOperation(operationId)
            }
            return operation
        })
        setData("operations", currentData )
        window.location.reload()

    })

 // Delete Operation 

 const removeOperationButtons = document.querySelectorAll(".removeOperation-btn");

    removeOperationButtons.forEach(button => {
        button.addEventListener("click", () => {
            showElement(["#removeOperationConfirmation"]);
        });
    })

    $(".btn-cancel-delete-operation").addEventListener("click", () => {
        hideElement(["#removeOperationConfirmation"])
    })

    $(".btn-confirm-delete-operation").addEventListener("click", () => {
        const operationIdToDelete = $(".btn-confirm-delete-operation").getAttribute("data-operation-id");
        if (operationIdToDelete) {
            deleteOperation(operationIdToDelete)
            hideElement(["#removeOperationConfirmation"])
            window.location.reload()
        }
    })


}
window.addEventListener("load", initializeApp)
