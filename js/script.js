let currentStep = 1;
let selectedDepartment = '';
let socialSciencesSpecialties = [
    { id: 'psychology', name: 'علم النفس', order: null },
    { id: 'education', name: 'علوم التربية', order: null },
    { id: 'sociology', name: 'علم الاجتماع', order: null },
    { id: 'demography', name: 'الديموغرافيا', order: null },
    { id: 'orthophony', name: 'الأرطوفونيا', order: null }
];
let humanitiesSpecialties = [
    { id: 'archaeology', name: 'علم الآثار', order: null },
    { id: 'libraryScience', name: 'علم المكتبات', order: null },
    { id: 'generalHistory', name: 'تاريخ عام', order: null },
    { id: 'mediaCommunication', name: 'إعلام واتصال', order: null }
];

document.addEventListener('DOMContentLoaded', function() {
    restoreFormData();
    document.getElementById('registrationForm').addEventListener('input', saveFormData);
    initializeSpecialties();
});

function saveFormData() {
    const formData = new FormData(document.getElementById('registrationForm'));
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    data.department = selectedDepartment;
    data.socialSciencesSpecialties = socialSciencesSpecialties;
    data.humanitiesSpecialties = humanitiesSpecialties;
    localStorage.setItem('registrationFormData', JSON.stringify(data));
}

function restoreFormData() {
    const savedData = localStorage.getItem('registrationFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        for (const [key, value] of Object.entries(data)) {
            if (key === 'department') {
                selectedDepartment = value;
                document.getElementById('department').value = value;
            } else if (key === 'socialSciencesSpecialties') {
                socialSciencesSpecialties = value;
                initializeSpecialties();
            } else if (key === 'humanitiesSpecialties') {
                humanitiesSpecialties = value;
                initializeSpecialties();
            } else {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) input.value = value;
            }
        }
    }
}

function initializeSpecialties() {
    const socialSciencesContainer = document.getElementById('social-sciences-container');
    const humanitiesContainer = document.getElementById('humanities-container');
    socialSciencesContainer.innerHTML = '';
    humanitiesContainer.innerHTML = '';

    socialSciencesSpecialties.forEach(specialty => {
        const card = document.createElement('div');
        card.className = 'preference-card';
        card.id = `card-${specialty.id}`;
        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div><h5>${specialty.name}</h5></div>
                <div>
                    <select id="${specialty.id}-order" name="specialty_${specialty.id}" class="form-select specialty-order" onchange="updateSpecialtyOrder('${specialty.id}', this.value, 'social')">
                        <option value="">اختر الأولوية</option>
                        <option value="1">الأولوية الأولى</option>
                        <option value="2">الأولوية الثانية</option>
                        <option value="3">الأولوية الثالثة</option>
                        <option value="4">الأولوية الرابعة</option>
                        <option value="5">الأولوية الخامسة</option>
                    </select>
                </div>
            </div>
        `;
        if (specialty.order) {
            card.querySelector('select').value = specialty.order;
            card.classList.add('selected');
        }
        socialSciencesContainer.appendChild(card);
    });

    humanitiesSpecialties.forEach(specialty => {
        const card = document.createElement('div');
        card.className = 'preference-card';
        card.id = `card-${specialty.id}`;
        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div><h5>${specialty.name}</h5></div>
                <div>
                    <select id="${specialty.id}-order" name="specialty_${specialty.id}" class="form-select specialty-order" onchange="updateSpecialtyOrder('${specialty.id}', this.value, 'humanities')">
                        <option value="">اختر الأولوية</option>
                        <option value="1">الأولوية الأولى</option>
                        <option value="2">الأولوية الثانية</option>
                        <option value="3">الأولوية الثالثة</option>
                        <option value="4">الأولوية الرابعة</option>
                    </select>
                </div>
            </div>
        `;
        if (specialty.order) {
            card.querySelector('select').value = specialty.order;
            card.classList.add('selected');
        }
        humanitiesContainer.appendChild(card);
    });
}

function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = (currentStep - 1) * (100 / 3);
    progressBar.style.width = `${progressPercentage}%`;
}

function nextStep(step) {
    if (!validateStep(step)) return;
    hideCurrentStep();
    currentStep = step + 1;
    showCurrentStep();
    updateProgress();
    updateStepIndicators();
    if (currentStep === 4) fillConfirmationData();
}

function previousStep(step) {
    hideCurrentStep();
    currentStep = step - 1;
    showCurrentStep();
    updateProgress();
    updateStepIndicators();
}

function hideCurrentStep() {
    const sections = {
        1: 'personalInfoSection',
        2: 'departmentSection',
        3: selectedDepartment === 'socialSciences' ? 'socialSciencesSection' : 'humanitiesSection',
        4: 'confirmationSection'
    };
    if (sections[currentStep]) {
        document.getElementById(sections[currentStep]).classList.add('hidden');
    }
}

function showCurrentStep() {
    const sections = {
        1: 'personalInfoSection',
        2: 'departmentSection',
        3: selectedDepartment === 'socialSciences' ? 'socialSciencesSection' : selectedDepartment === 'humanities' ? 'humanitiesSection' : 'departmentSection',
        4: 'confirmationSection',
        5: 'successSection'
    };
    if (sections[currentStep]) {
        document.getElementById(sections[currentStep]).classList.remove('hidden');
    }
    if (currentStep === 3 && !selectedDepartment) {
        currentStep = 2;
        document.getElementById('departmentSection').classList.remove('hidden');
    }
}

function updateStepIndicators() {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    for (let i = 1; i < currentStep; i++) {
        document.getElementById(`step${i}`).classList.add('completed');
    }
    if (currentStep <= 4) {
        document.getElementById(`step${currentStep}`).classList.add('active');
    }
}

function validateStep(step) {
    let isValid = true;
    switch(step) {
        case 1:
            const requiredFields = ['fname', 'lname', 'nom', 'prenom', 'birthdate', 'birthplace', 'email', 'phone', 'registrationNumber'];
            requiredFields.forEach(field => {
                const element = document.getElementById(field);
                if (element.value.trim() === '') {
                    element.classList.add('is-invalid');
                    isValid = false;
                } else {
                    element.classList.remove('is-invalid');
                }
            });
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(document.getElementById('email').value)) {
                document.getElementById('email').classList.add('is-invalid');
                isValid = false;
            }
            if (!isValid) showAlert('يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 'danger');
            break;
        case 2:
            if (!selectedDepartment) {
                showAlert('يرجى اختيار القسم', 'danger');
                isValid = false;
            }
            break;
        case 3:
            const specialties = selectedDepartment === 'socialSciences' ? socialSciencesSpecialties : humanitiesSpecialties;
            const usedOrders = new Set();
            let allSelected = true;
            specialties.forEach(specialty => {
                const orderElement = document.getElementById(`${specialty.id}-order`);
                if (!orderElement.value) {
                    allSelected = false;
                } else {
                    if (usedOrders.has(orderElement.value)) {
                        isValid = false;
                        orderElement.classList.add('is-invalid');
                    } else {
                        usedOrders.add(orderElement.value);
                        orderElement.classList.remove('is-invalid');
                    }
                }
            });
            if (!allSelected) {
                showAlert('يرجى اختيار أولوية لكل تخصص', 'danger');
                isValid = false;
            } else if (!isValid) {
                showAlert('يرجى اختيار أولوية مختلفة لكل تخصص', 'danger');
            }
            break;
        case 4:
            if (!document.getElementById('confirmAccuracy').checked) {
                document.getElementById('confirmAccuracy').classList.add('is-invalid');
                showAlert('يرجى الموافقة على صحة المعلومات', 'danger');
                isValid = false;
            } else {
                document.getElementById('confirmAccuracy').classList.remove('is-invalid');
            }
            break;
    }
    return isValid;
}

function selectDepartment(department) {
    selectedDepartment = department;
    document.getElementById('department').value = department;
    document.querySelectorAll('.department-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.department-card:nth-child(${department === 'socialSciences' ? 1 : 2})`).classList.add('selected');
    saveFormData();
}

function updateSpecialtyOrder(specialtyId, order, type) {
    const specialties = type === 'social' ? socialSciencesSpecialties : humanitiesSpecialties;
    const specialty = specialties.find(s => s.id === specialtyId);
    if (specialty) {
        specialty.order = order;
        const card = document.getElementById(`card-${specialtyId}`);
        if (order) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
        saveFormData();
    }
}

function fillConfirmationData() {
    document.getElementById('confirm-fname').textContent = document.getElementById('fname').value;
    document.getElementById('confirm-lname').textContent = document.getElementById('lname').value;
    document.getElementById('confirm-nom').textContent = document.getElementById('nom').value;
    document.getElementById('confirm-prenom').textContent = document.getElementById('prenom').value;
    document.getElementById('confirm-birthdate').textContent = document.getElementById('birthdate').value;
    document.getElementById('confirm-birthplace').textContent = document.getElementById('birthplace').value;
    document.getElementById('confirm-email').textContent = document.getElementById('email').value;
    document.getElementById('confirm-phone').textContent = document.getElementById('phone').value;
    document.getElementById('confirm-department').textContent = selectedDepartment === 'socialSciences' ? 'العلوم الاجتماعية' : 'العلوم الإنسانية';

    const confirmSpecialties = document.getElementById('confirm-specialties');
    confirmSpecialties.innerHTML = '';
    const specialties = selectedDepartment === 'socialSciences' ? socialSciencesSpecialties : humanitiesSpecialties;
    specialties.sort((a, b) => a.order - b.order).forEach(specialty => {
        if (specialty.order) {
            const p = document.createElement('p');
            p.innerHTML = `<strong>الأولوية ${specialty.order}:</strong> ${specialty.name}`;
            confirmSpecialties.appendChild(p);
        }
    });
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.progress-bar'));
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.addFont('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap', 'Tajawal', 'normal');
    doc.setFont('Tajawal');
    doc.setR2L(true);

    // Add university header
    doc.setFontSize(22);
    doc.text('جامعة لونيسي علي - البليدة 2', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('كلية العلوم الإنسانية والاجتماعية', 105, 30, { align: 'center' });
    doc.setFontSize(18);
    doc.text('استمارة التوجيه واختيار الرغبات', 105, 45, { align: 'center' });

    // Add personal information
    doc.setFontSize(14);
    doc.text('المعلومات الشخصية:', 190, 60, { align: 'right' });
    doc.setFontSize(12);
    doc.text(`الاسم: ${document.getElementById('fname').value}`, 190, 70, { align: 'right' });
    doc.text(`اللقب: ${document.getElementById('lname').value}`, 190, 80, { align: 'right' });
    doc.text(`Nom: ${document.getElementById('nom').value}`, 190, 90, { align: 'right' });
    doc.text(`Prénom: ${document.getElementById('prenom').value}`, 190, 100, { align: 'right' });
    doc.text(`تاريخ الميلاد: ${document.getElementById('birthdate').value}`, 190, 110, { align: 'right' });
    doc.text(`مكان الميلاد: ${document.getElementById('birthplace').value}`, 190, 120, { align: 'right' });
    doc.text(`البريد الإلكتروني: ${document.getElementById('email').value}`, 190, 130, { align: 'right' });
    doc.text(`رقم الهاتف: ${document.getElementById('phone').value}`, 190, 140, { align: 'right' });
    doc.text(`رقم التسجيل: ${document.getElementById('registrationNumber').value}`, 190, 150, { align: 'right' });

    // Add department and specialties
    doc.setFontSize(14);
    doc.text('القسم والتخصصات:', 190, 170, { align: 'right' });
    doc.setFontSize(12);
    doc.text(`القسم: ${selectedDepartment === 'socialSciences' ? 'العلوم الاجتماعية' : 'العلوم الإنسانية'}`, 190, 180, { align: 'right' });

    const specialties = selectedDepartment === 'socialSciences' ? socialSciencesSpecialties : humanitiesSpecialties;
    let yPos = 190;
    specialties.sort((a, b) => a.order - b.order).forEach(specialty => {
        if (specialty.order) {
            doc.text(`الأولوية ${specialty.order}: ${specialty.name}`, 190, yPos, { align: 'right' });
            yPos += 10;
        }
    });

    // Add reference number and date
    const referenceNumber = `REG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const today = new Date();
    const dateStr = today.toLocaleDateString('ar-DZ');
    doc.text(`رقم الطلب المرجعي: ${referenceNumber}`, 190, yPos + 20, { align: 'right' });
    doc.text(`تاريخ التقديم: ${dateStr}`, 190, yPos + 30, { align: 'right' });

    // Save the PDF
    doc.save('استمارة_التوجيه.pdf');
}

async function submitForm() {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> جاري الإرسال...';

    try {
        if (!validateStep(4)) {
            throw new Error('يرجى التحقق من صحة جميع المعلومات');
        }

        const formData = new FormData(document.getElementById('registrationForm'));
        
        // تجهيز البيانات للإرسال
        const data = {
            fname: formData.get('fname'),
            lname: formData.get('lname'),
            nom: formData.get('nom'),
            prenom: formData.get('prenom'),
            birthdate: formData.get('birthdate'),
            birthplace: formData.get('birthplace'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            registration_number: formData.get('registration_number'),
            department: formData.get('department'),
            specialties: selectedDepartment === 'socialSciences' ? socialSciencesSpecialties : humanitiesSpecialties,
            reference_number: `REG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            created_at: new Date().toISOString()
        };

        // التحقق من الحقول المطلوبة
        const requiredFields = ['fname', 'lname', 'nom', 'prenom', 'birthdate', 'birthplace', 'email', 'phone', 'registration_number', 'department'];
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error('يرجى ملء جميع الحقول المطلوبة');
            }
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            throw new Error('صيغة البريد الإلكتروني غير صالحة');
        }

        // إرسال البيانات إلى Google Sheets
        const googleScriptURL = 'https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec';
        
        // تحويل البيانات إلى تنسيق مناسب لـ Google Sheets
        const specialtiesFormatted = data.specialties
            .filter(s => s.order)
            .sort((a, b) => a.order - b.order)
            .map(s => `${s.name} (${s.order})`)
            .join(', ');
        
        const sheetData = {
            timestamp: data.created_at,
            reference: data.reference_number,
            fname_ar: data.fname,
            lname_ar: data.lname,
            fname_fr: data.nom,
            lname_fr: data.prenom,
            birthdate: data.birthdate,
            birthplace: data.birthplace,
            email: data.email,
            phone: data.phone,
            registration_number: data.registration_number,
            department: data.department === 'socialSciences' ? 'العلوم الاجتماعية' : 'العلوم الإنسانية',
            specialties: specialtiesFormatted
        };
        
        // إرسال البيانات باستخدام fetch API
        const response = await fetch(googleScriptURL, {
            method: 'POST',
            body: JSON.stringify(sheetData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('حدث خطأ أثناء إرسال البيانات');
        }
        
        // عرض صفحة النجاح
        document.getElementById('confirmationSection').classList.add('hidden');
        currentStep = 5;
        document.getElementById('successSection').classList.remove('hidden');
        document.getElementById('progressBar').style.width = '100%';
        document.getElementById('referenceNumber').textContent = data.reference_number;
        localStorage.removeItem('registrationFormData');
    } catch (error) {
        showAlert(`خطأ: ${error.message}`, 'danger');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i> إرسال الطلب';
    }
}

function resetForm() {
    document.getElementById('registrationForm').reset();
    document.getElementById('confirmAccuracy').checked = false;
    localStorage.removeItem('registrationFormData');
    currentStep = 1;
    selectedDepartment = '';
    socialSciencesSpecialties.forEach(specialty => specialty.order = null);
    humanitiesSpecialties.forEach(specialty => specialty.order = null);
    document.querySelectorAll('.preference-card').forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.department-card').forEach(card => card.classList.remove('selected'));
    initializeSpecialties();
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById('personalInfoSection').classList.remove('hidden');
    document.getElementById('progressBar').style.width = '0%';
    updateStepIndicators();
}
