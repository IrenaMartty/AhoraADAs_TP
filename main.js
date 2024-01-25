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

// Get Date

const date = new Date()
// console.log(date)

const curentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
$("#op-input-date").valueAsDate = curentDate
// console.log(date)

const firstDayOfTheMonth = new Date(date.getFullYear(), date.getMonth(), 2)
$("#pick-day").valueAsDate = firstDayOfTheMonth



/* CATEGORIES */


// Get categories 

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
        <button type="button" class="btn-edit-category text-sky-500 hover:text-black" onclick="editCategory('${category.id}')">Editar</button>
        <button type="button" class="btn-delete-category text-sky-500 hover:text-black" onclick="ejecutionDeleteCategoryBtn('${category.id}')">Eliminar</button>
        </td>
        <tr>
        `
    }
}

const renderCategoryOptions = (categories) => {
     $("#select-category").innerHTML = ""
     $("#form-select-category").innerHTML = ""
     $("#form-select-category").innerHTML += `<option value="Todas">Todas</option>`

 
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
    const updatedCategories = getData("categories").filter(category => category.id != categoryId)
    setData("categories", updatedCategories)
    return updatedCategories
}

const ejecutionDeleteCategoryBtn = (categoryId) => {
    renderCategories(deleteCategory(categoryId))
    const currentData = getData("operations").filter(operation => operation.category != categoryId)
    // console.log(currentData)
    setData("operations", currentData)
    renderOperations(currentData)

}

//Edit Category

const changeCategory = (categoryId) => {
    return {
        id: categoryId,
        name: $('#editCategory').value,
    }
}

const editCategory = (categoryId) => {
    const categoryEdited = getData("categories").find(category => category.id === categoryId)
    $("#editCategoryButton").setAttribute('data-id', categoryId)
    $('#editCategory').value = categoryEdited.name
    
}

$("#editCategoryButton").addEventListener("click", (e) => {
    e.preventDefault()
    const categoryId = $("#editCategoryButton").getAttribute("data-id")
    const currentData = getData("categories").map(category => {
        if(category.id === categoryId) {
            return changeCategory(categoryId)
        }
        return category
    })
    setData("categories", currentData)
    renderCategories(currentData)
    renderCategoryOptions(currentData)
    renderSummary(currentData)

    const currentDataOperations = getData("operations")

    renderOperations(currentDataOperations)

    
    hideElement(["#containerEditCategory"])
    showElement(["#categories-container"])
    
})


/* OPERATIONS */

//  Add New Operation

// Get operations

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

// Render Operations

const renderOperations = (operations) => {
    cleanContainer(".tbody-info-render")
    if (operations.length) {
        hideElement([".no-operations"])
        showElement([".operaciones-table-container"])
    for (const operation of operations) {
        const categorySelected = getData("categories").find(category => category.id === operation.category)
        const formattedAmount = operation.type === "ganancia" ? `+$${operation.amount}` : `-$${operation.amount}`
        const amountColor = operation.type === "ganancia" ? "text-emerald-500" : "text-rose-500"
// console.log (categorySelected)
        $(".tbody-info-render").innerHTML += `
        <tr class="">
            <td class="sm:pr-6 text-left">${operation.description}</td>
            <td class="px-3 py-1 text-s text-emerald-600 text-left font-bold max-md:hidden">${categorySelected ? categorySelected.name : ''}</td>
            <td class="sm:pr-6 text-left max-md:hidden">${operation.day}</td>
            <td class="sm:pr-6 text-left ${amountColor}">${formattedAmount}</td>
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

const editOperation = () => {
    const operationId = $("#edit-operation").getAttribute("data-id")
    const { description, amount, type, category, day } = getOperationDetails()

    if (description && !isNaN(amount) && type && category && day) {
        updateOperation(operationId)
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

/* FORM VALIDATIONS */

const validation = (field) => {
    const descriptionValidation = $("#input-description-text").value.trim()
    const amountValidation = $("#input-amount").valueAsNumber
    // const dateValidation = $("#op-input-date").valueAsDate
    let validationPass = descriptionValidation !== "" && amountValidation
   
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
}

if (validationPass) {
    $("#btn-add-newOp").removeAttribute("disabled")

} else {   
     $("#btn-add-newOp").setAttribute("disabled", true)
    }

}

const editCategoryValidation = (edit) => {
    const editCategoryValidation = $("#editCategory").value.trim()
    let editValidationPass = editCategoryValidation !== ""
    if (editCategoryValidation === "") {
        showElement([".error-message-category-edit"])
    } else {
        hideElement([".error-message-category-edit"])
    }

    if (editValidationPass) {
        $("#editCategoryButton").removeAttribute("disabled")
    
    } else {   
         $("#editCategoryButton").setAttribute("disabled", true)
        }

}



/* BALANCE CALCULATION */

const operations = getData("operations")
const formatAmount = (amount) => {
    return `$${Math.abs(amount)}`;
}

// Total income
const calculateIncome = () => {
    let acc = 0
    for (const operation of operations) {
        if (operation.type === "ganancia") {
            acc += operation.amount
        }
        
    }
    
    $("#income").innerText = formatAmount(acc)
    return acc
}

// Total cost
const calculateCost = () => {
    let acc = 0
    for (const operation of operations) {
        if (operation.type === "gasto") {
            acc -= operation.amount
        }
    }
    // console.log("Total Cost:", acc)
    $("#cost").innerText = formatAmount(acc)
    return acc
}

// Total calculation
const totalCalc = () => {{}
    const income = calculateIncome() 
    const cost = calculateCost() 
    const total = income + cost
    // console.log("Income:", income)
    // console.log("Cost:", cost)
    // console.log("total:", total)
   
    $("#total").innerText = formatAmount(total)

    const totalElement = $("#total");
    if (total >= 0) {
        totalElement.classList.remove("text-rose-500");
        totalElement.classList.add("text-emerald-500");
    } else {
        totalElement.classList.remove("text-emerald-500");
        totalElement.classList.add("text-rose-500");
    }


    return total
}

// FILTERS

const applyFilters = () => {
    const selectType = $("#form-select-type").value
    const selectCategory = $("#form-select-category").value
    const selectedDate = new Date($("#pick-day").value)
    const selectedOption = $("#form-select-order").value

    let filteredData = getData("operations")

    // Filter by type
    if (selectType !== "Todos") {
        filteredData = filteredData.filter(operation => operation.type === selectType)
    }

    // Filter by category
    if (selectCategory !== "Todas") {
        filteredData = filteredData.filter(operation => operation.category === selectCategory)
    }

    // Filter by date
    filteredData = filteredData.filter(operation => {
        const operationDate = new Date(operation.day)
        return operationDate >= selectedDate && operationDate <= new Date()
    })

    // Apply sorting
    switch (selectedOption) {
        case "Mas reciente":
            filteredData = filteredData.sort((a, b) => new Date(b.day) - new Date(a.day))
            break
        case "Menos reciente":
            filteredData = filteredData.sort((a, b) => new Date(a.day) - new Date(b.day))            
            break
        case "Mayor monto":
            filteredData = filteredData.sort((a, b) => b.amount - a.amount)
            break
        case "Menor monto":
            filteredData = filteredData.sort((a, b) => a.amount - b.amount)
            break
        case "A-Z":
            filteredData = filteredData.sort((a, b) => a.description.localeCompare(b.description))
            break
        case "Z-A":
            filteredData = filteredData.sort((a, b) => b.description.localeCompare(a.description))
            break
    }

    renderOperations(filteredData)
}

/* REPORTS */

// SUMMARY

// By Category

// Totals by category

const totalbyCategory = () => {
    return operations.reduce((acc, operation) => {
        const { category, amount, type } = operation
        const operationValue = type === "ganancia" ? amount : -amount

        if (!acc[category]) {
            acc[category] = {
                totalIncome: 0,
                totalCost: 0,
                totalBalance: 0,
            }
        }
        if (type === "ganancia") {
            acc[category].totalIncome += amount
        } else {
            acc[category].totalCost += amount
        }

        acc[category].totalBalance += operationValue

        return acc
    }, {})
}
// Category with the highest income

const categoryWithHighestIncome = (property) => {
    const totalNumbers = totalbyCategory()
    let highestCategory = Object.keys(totalNumbers)[0]

    for(const category in totalNumbers) {
        if (totalNumbers[category][property]> totalNumbers[highestCategory][property]) {
        highestCategory = category
    }
}
const categoryName = getCategoryNameById(highestCategory)
const highestAmount = totalNumbers[highestCategory][property]
return {categoryName, highestAmount}

}

// By Month
// Get Month
const getMonthAndYear = (monthNum, year) => {
    const allMonths = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",]
    if (monthNum >= 0 && monthNum <= 11) {
        return `${allMonths[monthNum]}/${year}`
}
}
// Totals by month
const totalByMonth = () => {
    return operations.reduce((acc, operation) => {
        const {day, amount, type} = operation
        const operationValue = type === "ganancia" ? amount : -amount

        const year = new Date(day).getFullYear()
        const month = new Date(day).getMonth()

        if(!acc[year]) {
            acc[year] = {}
        }
        if (!acc[year][month]) {
            acc[year][month] = {
                totalIncome: 0,
                totalCost: 0,
                totalBalance: 0,
            }
        }
        if (type === 'ganancia') {
            acc[year][month].totalIncome += amount
        } else {
            acc[year][month].totalCost += amount
        }

        acc[year][month].totalBalance += operationValue

        return acc
    }, {})
}

// Month with the highest income
const monthWithHighestIncome = (property) => {
    const totalNumbers = totalByMonth()
    let highestMonth = {year: null, month: null}
    let highestAmount = null

    for (const year in totalNumbers) {
        for(const month in totalNumbers[year]) {
            const currentAmount = totalNumbers[year][month][property]
            if (highestAmount === null || currentAmount > highestAmount) {
                highestAmount = currentAmount
                highestMonth = {year, month}
            }
        }
    }
    return {highestMonth, highestAmount}

}

// Renders

const renderCategorySum = (title, categoryType, amount) => {
    const{categoryName, highestAmount} = categoryWithHighestIncome(categoryType)
    $(".summary").innerHTML += `
    <li class="my-5 md:flex md:justify-between">
    <p class="mb-2 font-medium md:mb-0">${title}</p>
    <div class="flex justify-between md:w-1/3">
        <span class="py-1 text-emerald-600 font-bold">${categoryName}</span>
        <span class="font-medium ${amount < 0 ? 'text-rose-500' : amount > 0 ? 'text-emerald-500' : ''}">${amount > 0 ? '+' : amount < 0 ? '-' : ''}$${Math.abs(highestAmount)}</span>
    </div>
    </li>`
}

const renderMonthSum = (title, property, amount) => {
    const {highestMonth, highestAmount} = monthWithHighestIncome(property)
    $(".summary").innerHTML += `
    <li class="my-5 md:flex md:justify-between">
        <p class="mb-2 font-medium md:mb-0">${title}</p>
        <div class="flex justify-between md:w-1/3">
            <span>${getMonthAndYear(highestMonth.month, highestMonth.year)}</span>
            <span class="font-medium ${amount < 0 ? 'text-rose-500' : 'text-emerald-500'}">${amount > 0 ? '+' : '-'}$${Math.abs(highestAmount)}</span>
        </div>
    </li>`
}

const renderHighestIncomeCategory = () => renderCategorySum ("Categoría con mayor ganancia", "totalIncome", 1)
const renderHighestCostCategory = () => renderCategorySum ("Categoría con mayor gasto", "totalCost", -1)
const renderHighestBalanceCategory = () => renderCategorySum ("Categoría con mayor balance", "totalBalance", 0)
const renderHighestIncomeMonth = () => renderMonthSum ("Mes con mayor ganancia", "totalIncome", 1)
const renderHighestCostMonth = () => renderMonthSum ("Mes con mayor gasto", "totalCost", -1)

const renderSummary = () => {
    cleanContainer(".summary")
    renderHighestIncomeCategory()
    renderHighestCostCategory()
    renderHighestBalanceCategory()
    renderHighestIncomeMonth()
    renderHighestCostMonth()

}

// Render totals

// Totals by category

const renderTotalbyCategory = () => {
    const totalAmountsByCategory = totalbyCategory()

    cleanContainer(".reports-total-by-category")
    for (const category in totalAmountsByCategory) {
        const { totalIncome, totalCost, totalBalance } = totalAmountsByCategory[category]
        const balanceColor = totalBalance > 0 ? "text-emerald-500" : "text-rose-500"

        $(".reports-total-by-category").innerHTML += `
            <tr>
                <td class="pr-4 pb-5 font-medium md:pr-0">${getCategoryNameById(category)}</td>
                <td class="pr-4 pb-5 text-green-500 text-right md:pr-0">$${totalIncome}</td>
                <td class="pr-4 pb-5 text-rose-500 text-right md:pr-0">-$${totalCost}</td>
                <td class="pb-5 text-right font-bold ${balanceColor}">${totalBalance}</td>
            </tr>
        `
    }
}

// Totals by month

const renderTotalbyMonth = () => {
    const totalAmountsByMonth = totalByMonth()

    cleanContainer(".reports-total-by-months")
    for (const year in totalAmountsByMonth) {
        for (const month in totalAmountsByMonth[year]) {
            const { totalIncome, totalCost, totalBalance } = totalAmountsByMonth[year][month]
            const balanceColor = totalBalance > 0 ? "text-emerald-500" : "text-rose-500";
            $(".reports-total-by-months").innerHTML += `
                <tr>
                    <td class="pr-4 pb-5 font-medium md:pr-0">${getMonthAndYear(parseInt(month), parseInt(year))}</td>
                    <td class="pr-4 pb-5 text-green-500 text-right md:pr-0">+$${totalIncome}</td>
                    <td class="pr-4 pb-5 text-rose-500 text-right md:pr-0">-$${totalCost}</td>
                    <td class="pb-5 text-right font-bold ${balanceColor}">${totalBalance}</td>
                </tr>`
        }
    }
    
}

const reportUpdate = () => {
    const presentIncome = operations.some(({ type }) => type === "ganancia")
    const presentCost = operations.some(({ type }) => type === "gasto")

    if (presentIncome && presentCost) {
        showElement([".show-reports"])
        hideElement([".no-reports"])
        renderSummary()
        renderTotalbyCategory()
        renderTotalbyMonth()
    } else {
        hideElement([".show-reports"])
        showElement([".no-reports"])
    }
}

/* EVENTS */

const initializeApp = () => {
    setData("operations", allOperations) 
    setData("categories", allCategories)
    renderOperations(allOperations) 
    renderCategories(allCategories)
    renderCategoryOptions(allCategories)
    reportUpdate()
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

/* FILTERS */

$("#form-select-type").addEventListener("input", applyFilters)
$("#form-select-category").addEventListener("input", applyFilters)
$("#pick-day").addEventListener("input", applyFilters)
$("#form-select-order").addEventListener("input", applyFilters)

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
    $("#form-select-type").value = "Todos"
    $("#form-select-category").value = "Todas"
    $("#pick-day").valueAsDate = firstDayOfTheMonth
    $("#form-select-order").value = "Mas reciente"

    renderOperations(getData("operations"))
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

    // Cancel edit
    $("#EditCancelButton").addEventListener("click", () => {
        showElement([".categories-container"])
        hideElement(["#containerEditCategory"])
    }) 

    // Form validations

    $("#input-description-text").addEventListener("blur", () => validation("descriptionValidation"))
    $("#input-amount").addEventListener("blur", () => validation("amountValidation"))

    $("#editCategory").addEventListener("blur", editCategoryValidation)    

}

window.addEventListener("load", initializeApp)