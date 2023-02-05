


//~ 0365119

const urlQueries = window.location.search
queries = new URLSearchParams(urlQueries)
const IDNum = queries.get('id')

fetch(`https://dade-server.vercel.app/?id=${IDNum}`, { method: "GET" })
.then(res => res.text())
.then(data => {

    const re = /style=\"background-image: url[\;\&0-9a-zA-Z\(\)\'\.\=\:\/\?/-]*/i

    let html = data.replaceAll("/Pinnacle/", "https://gradebook.dadeschools.net/Pinnacle/")

    html = html
        .replaceAll(`href="Student`, `url-data="Student`)
        .replaceAll(`<form method="post" action="./GradeReport.aspx" id="aspnetForm" class="mainForm">`, "")
        .replaceAll("../Branding/DadeHeaderLogo.png", "https://gradebook.dadeschools.net/Pinnacle/Gradebook/Branding/DadeHeaderLogo.png")
        .replaceAll(`class="letter-container "`, `class="letter-container" href="javascript:void(0);" onclick="getCourse(this, ${IDNum})"`)
        .replace(re, `style="background-image: url('https://gradebook.dadeschools.net/Pinnacle/Gradebook/Images/NoPhoto.png')`)
        .replaceAll(`<a class="button-menu" href="#sideBar" aria-label="Menu" role="button">`, "")
        .replaceAll(`<i class="fa fa-fw fa-lg fa-bars"></i>`, "")
    
    html = new DOMParser().parseFromString(html, "text/html").querySelector("body")

    const root = document.createElement("div")
    root.setAttribute("id", "root")
    root.append(html)
    document.body.appendChild(root)
})


function getCourse(d, IDNum) {
    document.querySelector("#root").remove()

    const href = d.getAttribute("url-data").split("&").join("%26")

    fetch(`https://dade-server.vercel.app/course/?id=0${IDNum}&href=${href}`, { method: "GET" })
    .then(res => res.text())
    .then(data => {

        const re = /style=\"background-image: url[\;\&0-9a-zA-Z\(\)\'\.\=\:\/\?/-]*/i

        let html = data.replaceAll("/Pinnacle/", "https://gradebook.dadeschools.net/Pinnacle/")

        html = html
            .replaceAll(`href="Student`, `url-data="Student`)
            .replaceAll(`<form method="post"`, "<div")
            .replaceAll(`src="../Branding/DadeHeaderLogo.png" alt="Miami-Dade County Public Schools"`, "")
            .replaceAll(`class="assignment"`, `class="assignment" onclick="showControlPanel(this)"`)
            .replaceAll(`https://gradebook.dadeschools.net/Pinnacle/Gradebook/InternetViewer/GradeReport.aspx?Student=1067344`, `/grade_calculator/?id=0${IDNum}`)
            .replace(re, `style="background-image: url('https://gradebook.dadeschools.net/Pinnacle/Gradebook/Images/NoPhoto.png')`)
            .replaceAll(`<a class="button-menu" href="#sideBar" aria-label="Menu" role="button">`, "")
            .replaceAll(`<i class="fa fa-fw fa-lg fa-bars"></i>`, "")

        html = new DOMParser().parseFromString(html, "text/html").querySelector("body")

        const addNewBtn = document.createElement("button")
        addNewBtn.setAttribute("class", "addNewBtn")
        addNewBtn.setAttribute("onclick", "showPanel()")
        addNewBtn.innerHTML = "Add New Assignment"
        html.querySelector("#ContentMain > div:nth-child(3)").append(addNewBtn)

        const root = document.createElement("div")
        root.setAttribute("id", "root")
        root.append(html)
        document.body.appendChild(root)
    })
}


const Alettercolor = "#007F00";
const Abackgroundcolor = "#E6F2E6";
const Blettercolor = "#3F7F00";
const Bbackgroundcolor = "#E6F2DA";
const Clettercolor = "#7F7F00";
const Cbackgroundcolor = "#F2F2DA";
const Dlettercolor = "#7F3F00";
const Dbackgroundcolor = "#F2E6DA";
const Flettercolor = "#7F0000";
const Fbackgroundcolor = "#F2DADA";


function getFinalGrade(html) {
    //~ GETTING THE WEIGHTS OF EACH GRADECATEGORY
    const html_categories = Array.from(html.querySelector("#Categories").children[0].children)
    const categories = Object.fromEntries(html_categories.map(tr => [tr.children[1].innerText.split("\n")[0], tr.children[1].innerText.split("\n")[2].split(" ")[0]]))

    //~ GETTING ALL ASSIGNMENTS
    const html_assignments = Array.from(html.querySelector("#Assignments").children[0].children).flatMap(a => {
        if (a.tagName !== 'SCRIPT') {
            return a;
        } else {
            return [];
        }
    })

    const unfiltered_assignments = []
    for (a of html_assignments) {
        let obj = {}
        obj.category = a.children[1].children[1].textContent
        obj.grade = (a.children[3].children[0].children[0].children[0].innerText == 'X') ? a.children[3].children[0].children[0].children[0].innerText : a.children[3].children[0].children[0].children[0].innerText.split("\n")[1]
        unfiltered_assignments.push(obj)
    }

    const assignments = []
    for (category of Object.keys(categories)) {

        list = []
        for (i of unfiltered_assignments.filter(a => a.category == category)) {
            if (Object.values(i)[1] !== 'X') {
                list.push(Object.values(i)[1].slice(0, -1))
            }
        }

        assignments.push(Object.fromEntries(unfiltered_assignments.filter(a => a.category == category).map(o => [o.category, getAverage(list)])))
    }

    function getAverage(arr) {
        let total = 0;
        for (num of arr) {
            total += parseInt(num)
        }
        return Math.round(total / arr.length)
    }

    let total = 0;
    for (a of assignments) {
        total += Object.values(a)[0] * parseInt(categories[Object.keys(a)]) / 100
    }

    for (let i = 0; i < html_categories.length; i += 1) {
        const letter = html_categories[i].children[2].children[0]

        let final_grade = parseInt(Object.values(assignments[i])[0])
        let course_letter = null;
        if (final_grade >= 90) {
            course_letter = 'A'
            letter.style = `margin-left: 1rem; color: ${Alettercolor}; background-color: ${Abackgroundcolor}`
        }
        else if(80 <= final_grade && final_grade <= 89) {
            course_letter = 'B'
            letter.style = `margin-left: 1rem; color: ${Blettercolor}; background-color: ${Bbackgroundcolor}`
        }
        else if(70 <= final_grade && final_grade <= 79) {
            course_letter = 'C'
            letter.style = `margin-left: 1rem; color: ${Clettercolor}; background-color: ${Cbackgroundcolor}`
        }
        else if(60 <= final_grade && final_grade <= 69) {
            course_letter = 'D'
            letter.style = `margin-left: 1rem; color: ${Dlettercolor}; background-color: ${Dbackgroundcolor}`
        }
        else if(0 <= final_grade && final_grade <= 59) {
            course_letter = 'F'
            letter.style = `margin-left: 1rem; color: ${Flettercolor}; background-color: ${Fbackgroundcolor}`
        }

        letter.children[0].children[0].innerHTML = `\n\t\t\t\t\t\t\t\t\t\t\t\t\t${course_letter}\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span>${final_grade}%</span>\n\t\t\t\t\t\t\t\t\t\t\t\t`
    }

    let final_letter = null;
    const final_grade = Math.round(total)
    if (final_grade >= 90) {
        final_letter = 'A'
        document.querySelector("#ContentHeader > div > div.letter").style = `margin-left: 1rem; color: ${Alettercolor}; background-color: ${Abackgroundcolor}`
    }
    else if(80 <= final_grade && final_grade <= 89) {
        final_letter = 'B'
        document.querySelector("#ContentHeader > div > div.letter").style = `margin-left: 1rem; color: ${Blettercolor}; background-color: ${Bbackgroundcolor}`
    }
    else if(70 <= final_grade && final_grade <= 79) {
        final_letter = 'C'
        document.querySelector("#ContentHeader > div > div.letter").style = `margin-left: 1rem; color: ${Clettercolor}; background-color: ${Cbackgroundcolor}`
    }
    else if(60 <= final_grade && final_grade <= 69) {
        final_letter = 'D'
        document.querySelector("#ContentHeader > div > div.letter").style = `margin-left: 1rem; color: ${Dlettercolor}; background-color: ${Dbackgroundcolor}`
    }
    else if(0 <= final_grade && final_grade <= 59) {
        final_letter = 'F'
        document.querySelector("#ContentHeader > div > div.letter").style = `margin-left: 1rem; color: ${Flettercolor}; background-color: ${Fbackgroundcolor}`
    }

    document.querySelector("#ContentHeader > div > div.letter > div").innerHTML = `\n${final_letter}<span class="percent">${final_grade}%</span>\n`
}


function showControlPanel(d) {
    const category = d.children[1].children[1].textContent
    const grade = d.children[3].children[0].children[0].children[0].innerText.split("\n")[1].slice(0, -1)

    const row = d.children[1]

    if (row.childNodes.length == 5) {
        const row = d.children[1]
        const changingRow = document.createElement("div")
        changingRow.setAttribute("class", "changingRow")
        row.append(changingRow)

        const inp = document.createElement("input")
        inp.setAttribute("style", `position: relative; left: 10px; margin: 5px !important; border-radius: 10px; padding: 5px !important; background-color: #77cde762 !important; border: 1px solid rgba(0, 0, 0, 0.699) !important; width: 60px; height: 50px;`)
        inp.setAttribute("maxlength", "5")
        inp.setAttribute("value", d.children[3].children[0].children[0].children[0].innerText)
        inp.addEventListener("keypress", (e) => {
            if (e.keyCode == 13) {
                submitGrade(d.children[1].children[2].children[0])
            }
        })

        changingRow.append(inp)
    }
    else {
        void(0)
    }
}


function submitGrade(d) {
    const input = d.value
    d.parentElement.parentElement.parentElement.children[3].children[0].children[0].children[0].innerHTML = `${input[0]}<span class="percent">${input.slice(1)}</span>`

    const letter = d.parentElement.parentElement.parentElement.children[3].children[0]

    if (input[0] == 'A') {
        letter.style = `color: ${Alettercolor}; background-color: ${Abackgroundcolor}`
    }
    else if(input[0] == 'B') {
        letter.style = `color: ${Blettercolor}; background-color: ${Bbackgroundcolor}`
    }
    else if(input[0] == 'C') {
        letter.style = `color: ${Clettercolor}; background-color: ${Cbackgroundcolor}`
    }
    else if(input[0] == 'D') {
        letter.style = `color: ${Dlettercolor}; background-color: ${Dbackgroundcolor}`
    }
    else if(input[0] == 'F') {
        letter.style = `color: ${Flettercolor}; background-color: ${Fbackgroundcolor}`
    }

    getFinalGrade(document.querySelector("#root").children[0])

    d.parentElement.parentElement.removeChild(d.parentElement)
}


function showPanel() {
    const assignBox = document.createElement("tr")
    assignBox.setAttribute("class", "assignBox")

    const nameChange = document.createElement("input")
    nameChange.setAttribute("placeholder", "Assignment Name")
    assignBox.append(nameChange)

    const categoryChange = document.createElement("select")
    categoryChange.setAttribute("name", "category")
    const html_categories = Array.from(document.querySelector("#Categories").children[0].children)
    const categories = html_categories.map(tr => tr.children[1].innerText.split("\n")[0])
    const default_option = document.createElement("option")
    categoryChange.append(default_option)
    default_option.innerHTML = "Select a Category"
    for (category of categories) {
        const option = document.createElement("option")
        option.setAttribute("value", category)
        categoryChange.append(option)
        option.innerHTML = category
    }
    assignBox.append(categoryChange)

    const gradeChange = document.createElement("input")
    gradeChange.setAttribute("placeholder", "100%")
    gradeChange.setAttribute("maxlength", "4")
    assignBox.append(gradeChange)

    const btnChange = document.createElement("button")
    btnChange.setAttribute("onclick", `addNewAssignment(this.parentElement.children[0].value, this.parentElement.children[1].value, this.parentElement.children[2].value, this)`)
    assignBox.append(btnChange)
    btnChange.innerHTML = "Add"
    
    document.querySelector("#ContentMain > div:nth-child(3)").append(assignBox)
}


function addNewAssignment(name, category, percent, d) {
    document.querySelector("#ContentMain > div:nth-child(3)").removeChild(d.parentElement)

    const tbody = document.querySelector("#Assignments > tbody")

    const newAssignment = document.createElement("tr")
    newAssignment.setAttribute("class", "assignment")

    const _date = document.createElement("td")
    _date.setAttribute("class", "icon-date")
    const _time = document.createElement("time")
    _time.setAttribute("class", "date-due")
    _time.setAttribute("datetime", "2022-09-11T00:00:00")
    _date.append(_time)
    const _span = document.createElement("span")
    _time.innerHTML = "<span>Sep</span>11 "

    const _description = document.createElement("td")
    _description.setAttribute("class", "description")
    const _title = document.createElement("div")
    _title.setAttribute("class", "title")
    _description.append(_title)
    _title.innerHTML = name
    const _category = document.createElement("div")
    _category.setAttribute("class", "category")
    _description.append(_category)
    _category.innerHTML = category
    
    const _numbers = document.createElement("td")
    _numbers.setAttribute("class", "numeric")
    const _numeric = document.createElement("div")
    _numeric.setAttribute("class", "numeric")
    _numbers.append(_numeric)
    const _points = document.createElement("span")
    _points.setAttribute("class", "points")
    _numeric.append(_points)
    _points.innerHTML = percent.slice(0, -1)
    const _max = document.createElement("div")
    _max.setAttribute("class", "max")
    _numeric.append(_max)
    _max.innerHTML = "max 100"

    const _letter = document.createElement("td")
    _letter.setAttribute("class", "letter")
    const _l1 = document.createElement("div")
    _l1.setAttribute("class", "letter")

    const final_grade = percent.slice(0, -1)
    if (final_grade >= 90) {
        _l1.setAttribute("style", `color: ${Alettercolor}; background-color: ${Abackgroundcolor}`)
        _letter.append(_l1)
        const _l2 = document.createElement("div")
        _l1.append(_l2)
        const _l3 = document.createElement("div")
        _l2.append(_l3)
        _l3.innerHTML = 'A'
        const _l4 = document.createElement("span")
        _l4.setAttribute("class", "percent")
        _l3.append(_l4)
        _l4.innerHTML = percent
    }
    else if(80 <= final_grade && final_grade <= 89) {
        _l1.setAttribute("style", `color: ${Blettercolor}; background-color: ${Bbackgroundcolor}`)
        _letter.append(_l1)
        const _l2 = document.createElement("div")
        _l1.append(_l2)
        const _l3 = document.createElement("div")
        _l2.append(_l3)
        _l3.innerHTML = 'B'
        const _l4 = document.createElement("span")
        _l4.setAttribute("class", "percent")
        _l3.append(_l4)
        _l4.innerHTML = percent
    }
    else if(70 <= final_grade && final_grade <= 79) {
        _l1.setAttribute("style", `color: ${Clettercolor}; background-color: ${Cbackgroundcolor}`)
        _letter.append(_l1)
        const _l2 = document.createElement("div")
        _l1.append(_l2)
        const _l3 = document.createElement("div")
        _l2.append(_l3)
        _l3.innerHTML = 'C'
        const _l4 = document.createElement("span")
        _l4.setAttribute("class", "percent")
        _l3.append(_l4)
        _l4.innerHTML = percent
    }
    else if(60 <= final_grade && final_grade <= 69) {
        _l1.setAttribute("style", `color: ${Dlettercolor}; background-color: ${Dbackgroundcolor}`)
        _letter.append(_l1)
        const _l2 = document.createElement("div")
        _l1.append(_l2)
        const _l3 = document.createElement("div")
        _l2.append(_l3)
        _l3.innerHTML = 'D'
        const _l4 = document.createElement("span")
        _l4.setAttribute("class", "percent")
        _l3.append(_l4)
        _l4.innerHTML = percent
    }
    else if(0 <= final_grade && final_grade <= 59) {
        _l1.setAttribute("style", `color: ${Flettercolor}; background-color: ${Fbackgroundcolor}`)
        _letter.append(_l1)
        const _l2 = document.createElement("div")
        _l1.append(_l2)
        const _l3 = document.createElement("div")
        _l2.append(_l3)
        _l3.innerHTML = 'F'
        const _l4 = document.createElement("span")
        _l4.setAttribute("class", "percent")
        _l3.append(_l4)
        _l4.innerHTML = percent
    }

    newAssignment.append(_date)
    newAssignment.append(_description)
    newAssignment.append(_numbers)
    newAssignment.append(_letter)

    tbody.prepend(newAssignment)

    getFinalGrade(document.querySelector("#root").children[0])
}