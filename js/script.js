/* ================= HEADER SCROLL ================= */
let lastScroll = 0;

const headerMiddle = document.querySelector('.header-middle');

window.addEventListener('scroll', () => {
	const current = window.scrollY;

	if (current > lastScroll && current > 50) {
		headerMiddle.classList.add('hidden');
	} else {
		headerMiddle.classList.remove('hidden');
	}

	lastScroll = current;
});

/* ================= БУРГЕР МЕНЮ ================= */
const burger = document.querySelector('.burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.querySelector('.mobile-close');

burger.addEventListener('click', () => {
	mobileMenu.classList.add('open');
	document.body.classList.add('no-scroll');
});

mobileClose.addEventListener('click', closeMobileMenu);

mobileMenu.addEventListener('click', e => {
	if (e.target === mobileMenu) closeMobileMenu();
});

// Закрытие мобильного меню
function closeMobileMenu() {
	mobileMenu.classList.remove('open');
	document.body.classList.remove('no-scroll');
}

document.querySelectorAll('.mobile-nav a').forEach(link => {
	link.addEventListener('click', closeMobileMenu);
});

/* ================= МОДАЛЬНОЕ ОКНО ================= */
const modal = document.getElementById('modal');
const modalBody = modal.querySelector('.modal-body');
const modalClose = modal.querySelector('.modal-close');
const modalOverlay = modal.querySelector('.modal-overlay');

/* ================= ПРОСТАЯ ВАЛИДАЦИЯ ================= */

// Валидация формы
function validateForm(form) {
	let isValid = true;
	const inputs = form.querySelectorAll('input[required]');

	// Удаляем все старые ошибки
	form.querySelectorAll('.error-message').forEach(el => el.remove());

	inputs.forEach(input => {
		input.classList.remove('error');

		// Проверка на пустое поле
		if (!input.value.trim()) {
			showError(input, 'Это поле обязательно');
			isValid = false;
		}
		// Проверка email
		else if (input.type === 'email' && !isValidEmail(input.value)) {
			showError(input, 'Введите корректный email');
			isValid = false;
		}
		// Проверка имени (минимум 2 символа)
		else if (input.type === 'text' && input.value.trim().length < 2) {
			showError(input, 'Минимум 2 символа');
			isValid = false;
		}
	});

	return isValid;
}

// Показ ошибки под полем
function showError(input, message) {
	input.classList.add('error');
	const error = document.createElement('span');
	error.className = 'error-message';
	error.textContent = message;
	input.parentNode.appendChild(error);
}

// Проверка email
function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ================= МОДАЛЬНЫЕ ОКНА ================= */
const session = {
	modalOpened: false,
	requestSent: false,
	timerTriggered: false,
	footerTriggered: false
};

// Шаблон модального окна
function getModalTemplate(type) {
	const form = `
        <form class="js-form">
            <div class="form-group">
                <input type="text" required placeholder="Ваше имя">
            </div>
            
            <div class="form-group">
                <input type="email" required placeholder="Ваш email">
            </div>
            
            <div class="form-group">
                <input type="tel" placeholder="Телефон (необязательно)">
            </div>
            
            <button type="submit">Отправить</button>
        </form>
    `;

	if (type === 'time') return `<h3>Вы всё ещё здесь?</h3><p>Давайте обсудим ваш проект!</p>${form}`;
	if (type === 'footer') return `<h3>Дошли до конца!</h3><p>Понравилось наше портфолио?</p>${form}`;
	if (type === 'contact') return `<h3>Связаться с нами</h3><p>Заполните форму и мы ответим вам</p>${form}`;

	return `<h3>Модальное окно</h3>${form}`;
}

// Открытие модального окна
function openModal(type) {
	if (session.modalOpened || session.requestSent) return;

	if (type === 'time') session.timerTriggered = true;
	if (type === 'footer') session.footerTriggered = true;

	session.modalOpened = true;
	modalBody.innerHTML = getModalTemplate(type);
	modal.classList.add('open');
	document.body.classList.add('no-scroll');

	const form = modal.querySelector('.js-form');
	if (form) {
		form.addEventListener('submit', handleFormSubmit);
	}
}

// Обработка отправки формы
function handleFormSubmit(e) {
	e.preventDefault();

	const form = e.target;

	if (!validateForm(form)) {
		return;
	}

	// Показываем индикатор загрузки
	const submitBtn = form.querySelector('button');
	const originalText = submitBtn.textContent;
	submitBtn.textContent = 'Отправка...';
	submitBtn.disabled = true;

	// Имитация отправки
	setTimeout(() => {
		session.requestSent = true;

		// Показываем сообщение об успехе
		modalBody.innerHTML = `
            <div style="text-align: center; padding: 40px 0;">
                <i class="fas fa-check-circle" style="font-size: 48px; color: #10b981; margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 16px; color: #1f2937;">Форма успешно отправлена!</h3>
                <p style="color: #6b7280;">Мы свяжемся с вами в ближайшее время</p>
            </div>
        `;

		// Закрываем модалку через 1.5 секунды
		setTimeout(() => {
			closeModal();
		}, 1500);

	}, 1000);
}

// Закрытие модального окна
function closeModal() {
	modal.classList.remove('open');
	document.body.classList.remove('no-scroll');

	setTimeout(() => {
		session.modalOpened = false;
	}, 300);
}

modalClose.onclick = closeModal;
modalOverlay.onclick = closeModal;

document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && modal.classList.contains('open')) {
		closeModal();
	}
});

modal.querySelector('.modal-content')?.addEventListener('click', (e) => {
	e.stopPropagation();
});

/* ================= ТРИГГЕРЫ МОДАЛОК ================= */
let timerId;

// Таймер на 40 секунд
timerId = setTimeout(() => {
	if (!session.modalOpened && !session.requestSent && !session.footerTriggered) {
		openModal('time');
	}
}, 40000);

// Модалка при скролле до футера
const footer = document.querySelector('.footer');
const footerObserver = new IntersectionObserver(([entry]) => {
	if (entry.isIntersecting) {
		clearTimeout(timerId);
		if (!session.modalOpened && !session.requestSent) {
			openModal('footer');
		}
		footerObserver.disconnect();
	}
}, {
	threshold: 0.5
});

if (footer) {
	footerObserver.observe(footer);
}

// Кнопки "Связаться"
document.querySelectorAll('.contact-btn').forEach(btn => {
	btn.addEventListener('click', () => {
		closeMobileMenu();
		openModal('contact');
	});
});

/* ================= КРЕАТИВНАЯ ВИТРИНА ================= */
const showcaseContainer = document.getElementById('showcaseContainer');
const filterButtons = document.querySelectorAll('.palette-btn');
const searchInput = document.getElementById('projectSearch');
const shuffleBtn = document.getElementById('shuffleBtn');

const projectsData = [
	{
		id: 1,
		type: 'ui',
		name: 'Neon UI Concept',
		desc: 'Инновационный дизайн с неоновыми элементами',
		color: '#10b981',
		icon: '🎨',
		tags: ['UI Design', 'Dark Theme']
	},
	{
		id: 2,
		type: 'frontend',
		name: 'React Dashboard',
		desc: 'Интерактивная панель управления с графиками',
		color: '#3b82f6',
		icon: '⚛️',
		tags: ['React', 'Vue.js']
	},
	{
		id: 3,
		type: 'motion',
		name: '3D Web Experience',
		desc: '3D опыт в браузере',
		color: '#f59e0b',
		icon: '🎬',
		tags: ['Three.js', 'WebGL']
	},
	{
		id: 4,
		type: 'ui',
		name: 'Design',
		desc: 'Современный дизайн с эффектами стекла',
		color: '#06b6d4',
		icon: '💎',
		tags: ['Pixso', 'Figma']
	},
	{
		id: 5,
		type: 'frontend',
		name: 'Real-time Chat',
		desc: 'Чат с WebSocket соединением и уведомлениями',
		color: '#8b5cf6',
		icon: '💬',
		tags: ['WebSocket', 'Node.js']
	},
	{
		id: 6,
		type: 'motion',
		name: 'Micro-interactions Pack',
		desc: 'Набор интеграций для UX',
		color: '#f97316',
		icon: '✨',
		tags: ['CSS Animations', 'UX']
	}
];

let currentFilter = 'all';
let searchQuery = '';

// Инициализация витрины
function initShowcase() {
	generateCards();
	setupEventListeners();
}

// Генерация карточек
function generateCards() {
	showcaseContainer.innerHTML = '';

	let filteredProjects = projectsData.filter(project => {
		const matchesFilter = currentFilter === 'all' || project.type === currentFilter;
		const matchesSearch = !searchQuery ||
			project.name.toLowerCase().includes(searchQuery) ||
			project.desc.toLowerCase().includes(searchQuery);
		return matchesFilter && matchesSearch;
	});

	filteredProjects.forEach((project, index) => {
		const card = document.createElement('div');
		card.className = 'project-card';
		card.dataset.type = project.type;
		card.dataset.id = project.id;

		const rgb = hexToRgb(project.color);
		card.style.setProperty('--hue', rgb);
		card.style.animationDelay = `${index * 0.1}s`;

		card.innerHTML = `
            <div class="card-content">
                <div class="card-icon">${project.icon}</div>
                <h3 class="card-title">${project.name}</h3>
                <p class="card-desc">${project.desc}</p>
                <div class="card-tags">
                    ${project.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

		card.addEventListener('click', () => {
			card.classList.toggle('expanded');
		});

		showcaseContainer.appendChild(card);
	});
}

// Конвертация HEX в RGB
function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ?
		`${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
		: '139, 92, 246';
}

// Настройка обработчиков событий
function setupEventListeners() {
	filterButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			filterButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			currentFilter = btn.dataset.filter;
			generateCards();
		});
	});

	searchInput.addEventListener('input', (e) => {
		searchQuery = e.target.value.toLowerCase();
		generateCards();
	});

	shuffleBtn.addEventListener('click', () => {
		showcaseContainer.classList.add('shuffling');

		const cards = Array.from(showcaseContainer.children);
		cards.sort(() => Math.random() - 0.5);

		setTimeout(() => {
			showcaseContainer.innerHTML = '';
			cards.forEach(card => {
				showcaseContainer.appendChild(card);
			});

			showcaseContainer.classList.remove('shuffling');
		}, 300);
	});
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
	initShowcase();

	setTimeout(() => {
		document.querySelectorAll('.project-card').forEach((card, i) => {
			card.style.animationDelay = `${i * 0.1}s`;
		});
	}, 100);
});