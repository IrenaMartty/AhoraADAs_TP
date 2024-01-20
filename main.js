/* UTILITIES */

const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))

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

// Date

const date = new Date()
console.log(date)

const curentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
$("#op-input-date").valueAsDate = curentDate
console.log(date)

const firstDayOfTheMonth = new Date(date.getFullYear(), date.getMonth(), 2)
$("#pick-day").valueAsDate = firstDayOfTheMonth


// CATEGORIES
const getCategoryNameById = (categoryId) => {
    const categorySelected = getCategories().find(({id}) => id === categoryId)
    return categorySelected ? categorySelected.name : ''
}


// Default categories

const defaultCategory = [
    {
        id: randomId(),
        name: "Comida"
    },
    {
        id: randomId(),
        name: "Salidas"
    },
    {
        id: randomId(),
        name: "Servicios"
    },
    {
        id: randomId(),
        name: "Educación"
    },
    {
        id: randomId(),
        name: "Transporte"
    },
    {
        id: randomId(),
        name: "Trabajo"
    }
]


const allOperations = getData("operations") || []
// const allCategoriesData = getData("categories") || {}
const allCategories = getData("categories") || defaultCategory
const getCategories = () => getData("categories") || []
// const allCategories = allCategoriesData.defaultCategory || defaultCategory
// console.log('cata', allCategories)



//  Render categories

const renderCategories = (categories) => {
    cleanContainer(".tbody-category-render")
    for (const category of categories){
        $(".tbody-category-render").innerHTML += `
        <tr class="">
        <td class="text-emerald-600 rounded">${category.name}</td>
        <td class="text-right">
        <button type="button" class="btn-edit-category text-sky-500 hover:text-black">Editar</button>
        <button type="button" class="btn-delete-category text-sky-500 hover:text-black" onclick="deleteCategory('${category.id}')">Eliminar</button>
        </td>
        <tr>
        `
    }
}

const renderCategoryOptions = (categories) => {
     // Clear existing options
     $("#select-category").innerHTML = "";
     $("#form-select-category").innerHTML = "";
 
    for (const category of categories) {
        $("#select-category").innerHTML += `
        <option value="${category.id}">${category.name}</option>
        `
        $("#form-select-category").innerHTML += `
        <option value="${category.id}">${category.name}</option>
        `
        
    }
}


// Add category
const addCategory = () => {
    const categoryName = $("#input-add-category").value
    if (categoryName) {
        const newCategory = {
            id: randomId(),
            name: categoryName
        }
        const updatedCategories = [...getCategories(), newCategory]
        $("#input-add-category").value = ""

        renderCategories(updatedCategories)
        renderCategoryOptions(updatedCategories)
        
        setData("categories", updatedCategories)
        
    }
    } 

// Delete Category


const deleteCategory = (categoryId) => {
    const updatedCategories = getData("categories").filter(category => category.id !== categoryId)
    // console.log(updatedCategories)
    setData("categories", updatedCategories)
    renderCategories(updatedCategories)
    renderCategoryOptions(updatedCategories)
}

const ejecutionDeleteCategoryBtn = (categoryId) => {
    renderCategories(deleteCategory(categoryId))
    const updatedData = getData("operations").filter(operation => operation.category !== categoryId)
    console.log(updatedData)
    set("operations", updatedData)
     
}

//Edit Category

// const editCategory = (categoryId) => {
//     return {
//         id: categoryId,
//         name: $("#editCategory").value
//     }

// }



// OPERATIONS

//  Add New Operation

const getOperationById = (operationId) => getOperations().find(({id}) => id === operationId)


const saveOperation = (operationId) => {
    return{
        id: operationId ? operationId :randomId(),
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
            $(".operaciones-container").classList.remove("hidden")
            $(".operaciones-table-container").classList.add("hidden")
         }

    const categoryName = (idCategory) => {
        for(const category of getData("categories")){
          if(idCategory === category.id){
            return(category.name)
          }
        }
      }

    for (const operation of arrayOperations) {    
        $(".tbody-info-render").innerHTML +=

   `<tr>
        <td class="text-center border-r-6 p-3max-w-[150px]">${operation.description}</td>
        <td class="text-center border-r-6 p-3">
            <p class="bg-slate-300 text-center rounded-md">${category.name}</p>
         </td>
        <td class="text-center border-r-6 p-3">${operation.day}</td>
        <td class="text-center border-r-6 p-3" id="num-amount">${operation.amount}</td>
        <td class="p-3 flex flex-col">
            <button class="bg-slate-300 text-center mb-1 border-r-6 rounded-md" >Editar</button>
            <button class="bg-slate-300 text-center border-r-6 rounded-md" '${operation.description}')">Eliminar</button>
        </td>
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
        const categorySelected = getData("categories").find(category => category.id === operation.category)
// console.log (categorySelected)
        $(".tbody-info-render").innerHTML += `
        <tr class="">
            <td class="sm:pr-6 text-left">${operation.description}</td>
            <td class="text-s text-emerald-600 bg-emerald-50 rounded text-left max-md:hidden">${categorySelected}</td>
            <td class="sm:pr-6 text-left max-md:hidden">${operation.day}</td>
            <td class="sm:pr-6 text-left">${operation.amount}</td>
            <td>
                <button class="containerEditOperation-btn text-sky-500 hover:text-black" data-id onclick="editForm('${operation.id}')">Editar</i></button>
                <button type="button" class="btn removeOperation-btn text-sky-500 hover:text-black" data-id onclick="ejecutionDeleteBtn('${operation.id}','${operation.description}')">Eliminar</button>
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
        deleteOperation(operationId)
        showOperations(getData("operations"))
    })
}

const deleteOperation = (operationId) => {
    const currentData = getData("operations").filter(operation => operation.id != operationId)
    setData("operations", currentData)
    window.location.reload()

}

/* VALIDATIONS */

const validation = (field) => {
    const descriptionValidation = $("#input-description-text").value.trim()
    const amountValidation = $("#input-amount").valueAsNumber
    const dateValidation = $("#op-input-date").valueAsDate
    let validationPass = descriptionValidation !== "" && amountValidation  && dateValidation
   
    switch (field) {
        case "descriptionValidation":
    if (descriptionValidation === "") {
        showElement([".error-message-description"])
    } else {
        hideElement([".error-message-description"])

    }
    break
    case "amountValidation":
    if (!amountValidation) {
        showElement([".error-message-monto"])
    } else {
        hideElement([".error-message-monto"])
    }
    break
    case "dateValidation":

    if (!dateValidation) {
        showElement([".error-message-date"])
    } else {
        hideElement([".error-message-date"])
    }
    break
    // default: alert("Error")
}
if (validationPass) {
    $("#btn-add-newOp").removeAttribute("disabled")

} else {   
     $("#btn-add-newOp").addAttribute("disabled", true)

}

}

// BALANCE CALCULATION
const operations = getData("operations")
console.log("Operations Data:", operations)

// Total income
const calculateIncome = () => {
    const operations = getData("operations")
    let acc = 0
    for (const operation of operations) {
        if (operation.type === "ganancia") {
            acc += operation.amount
    }

}
console.log("Total Income:", acc)
    return acc

}

// Total cost
const calculateCost = () => {
    const operations = getData("operations")
    let acc = 0
    for (const operation of operations) {
        if (operation.type === "gasto") {
            acc -= operation.amount
        }
    }
    console.log("Total Cost:", acc)
    return acc
}

// Total calculation
const totalCalc = () => {
    const income = calculateIncome()
    const cost = calculateCost()
    const total = cost + income
    return total
}

// FILTERS

// Filter by type
const filterType = (operations, operationType) => operations.filter(({type}) => type === operationType)

// Filter by category
const filterCategory = (operations, operationCategory) => operations.filter(({category}) => category === operationCategory)

// Filter by date
const filterDate = (operations, operationDate) => operations.filter(({day}) => new Date(day).getTime() >= operationDate.getTime())

// Filter by order
// date
const byDate = (operations, order) => {
    return [...operations].sort((a, b) => {
        const dateA = new Date(a.day).getTime();
        const dateB = new Date(b.day).getTime();
        return order === 'recent' ? dateB - dateA : dateA - dateB;
    });
}
// amount
const byAmount = (operations, order) => {
    return [...operations].sort((a, b) => {
        return order === 'max' ? b.amount - a.amount : a.amount - b.amount
    })
}

// alphabet
const byAlphabet = (operations, order) => {
    return [...operations].sort((a, b) => {
        const descriptionA = a.description.toLowerCase()
        const descriptionB = b.description.toLowerCase()
        return order === 'aZ' ? descriptionA.localeCompare(descriptionB) : descriptionB.localeCompare(descriptionA)
    })
}

const allFilters = () => {
    const typeFilter = $("#form-select-type").value
    const categoryFilter = $("#form-select-category").value
    const dateFilter = new Date($("#pick-day").value)
    const orderFilter = $("#form-select-order").value

    let filteredOperations = [...operations]

    if (typeFilter !== "Todos") {
        filteredOperations = filterType(filteredOperations, typeFilter);
    }


    renderOperations(filteredOperations)
    
}




/* EVENTS */

const initializeApp = () => {
    setData("operations", allOperations) 
    setData("categories", allCategories)
    renderOperations(allOperations) 
    renderCategories(allCategories)
    renderCategoryOptions(allCategories)
    // addCategory(allCategories)
$("#income").innerText = calculateIncome()
$("#cost").innerText = calculateCost()
$("#total").innerText = totalCalc()



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

 const removeOperationButtons = document.querySelectorAll(".removeOperation-btn")

    removeOperationButtons.forEach(button => {
        button.addEventListener("click", () => {
            showElement(["#removeOperationConfirmation"])
        })
    })

    $(".btn-cancel-delete-operation").addEventListener("click", () => {
        hideElement(["#removeOperationConfirmation"])
    })

    $(".btn-confirm-delete-operation").addEventListener("click", () => {
        const operationIdToDelete = $(".btn-confirm-delete-operation").getAttribute("data-operation-id")
        if (operationIdToDelete) {
            deleteOperation(operationIdToDelete)
            hideElement(["#removeOperationConfirmation"])
            window.location.reload()
        }
    })

    // Filters
    $(".hide-filters-btn").addEventListener("click", () => {
        hideElement([".filtros-form"])
        hideElement([".hide-filters-btn"])
        showElement([".show-filters-btn"])
        hideElement([".remove-filters-btn"])
    })
        $(".show-filters-btn").addEventListener("click", () => {
        showElement([".filtros-form"])
        showElement([".hide-filters-btn"])
        showElement([".remove-filters-btn"])
        hideElement([".show-filters-btn"])
    })
    
    $(".remove-filters-btn").addEventListener("click", () => {
    $(".form-select-category").value = "Todas";
    $(".form-select-type").value = "todos";
    $(".pick-day").valueAsDate = firstDayOfTheMonth
    $(".form-select-order").value = "Mas reciente"

    renderOperations(getData("operations"));
})



    // Add category

    $("#btn-add-categories").addEventListener("click", (e) => {
            e.preventDefault()
            addCategory()
            $("#category-form").reset()
        }) 

    // Edit category

    const editCategoryButtons = document.querySelectorAll(".btn-edit-category")

     editCategoryButtons.forEach(button => {
         button.addEventListener("click", () => {
            hideElement([".categories-container"])
            showElement(["#containerEditCategory"])

     })

    }) 
// cancel edit
    $("#EditCancelButton").addEventListener("click", () => {
        showElement([".categories-container"])
        hideElement(["#containerEditCategory"])
    }) 


// edit confirmation button
    
     // Delete category

// const deleteCategoryButtons = document.querySelectorAll(".btn-delete-category")

//      deleteCategoryButtons.forEach(button => {
//          button.addEventListener("click", () => {
//             showElement(["#removeCategoryConfirmation"])

//      })
//     }) 
//     $(".btn-cancel-delete").addEventListener("click", () => {
//         hideElement(["#removeCategoryConfirmation"])
//     }) 


//     $("#btn-remove-categories").addEventListener("click", () => {
//         console.log("Button clicked!")
//         const categoryIdToDelete = $("#btn-remove-categories").getAttribute("data-category-id")
//         if (categoryIdToDelete) {
//             deleteCategory(categoryIdToDelete)
//             renderCategories(deleteCategory(categoryId))
//     setData("categories", currentData)
//             hideElement(["#removeOperationConfirmation"])
//             window.location.reload()
//         }
//     })

    // Validations

    $("#input-description-text").addEventListener("blur", () => validation("descriptionValidation"))
    $("#input-amount").addEventListener("blur", () => validation("amountValidation"))
    $("#op-input-date").addEventListener("blur", () => validation("dateValidation"))

}

window.addEventListener("load", initializeApp)
