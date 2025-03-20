'use strict';

const app = {};

app.name = 'UI Layout | Dashboard';
app.version = '1.0.0';
app.breakpointSize = 1024,
app.theme = '',

app.element = {
    sidebar: document.getElementById('sidebar'),
    navbar: document.getElementById('navbar'),
    navbarMenu: document.getElementById('navbar-menu'),
    sidebarOpenButton: document.getElementById('sidebar-open-button'),
    notificationsMenuToggleButton: document.getElementById('notifications-menu-toggle-button'),
    darkModeMenuToggleButton: document.getElementById('dark-mode-menu-toggle-button'),
    navbarMenuToggleButton: document.getElementById('navbar-menu-toggle-button'),
    themeLightButton: document.getElementById('theme-light-button'),
    themeDarkButton: document.getElementById('theme-dark-button'),
    themeSystemButton: document.getElementById('theme-system-button'),
    footerAppName: document.getElementById('footer-app-name'),
    footerAppVersion: document.getElementById('footer-app-version'),
    footerAppYear: document.getElementById('footer-app-year'),
}

app.component = {
    sidebar: {
        open(button) {
            app.component.overlay.toggle(button, true);
            this.removeInert(button);
        },
        close(button) {
            app.component.overlay.toggle(button, false);
            if (window.innerWidth >= breakpointSize) this.removeInert(button);
        },
        removeInert(button) {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);
            if (!element) return;
            element.removeAttribute('inert');
        },
        toggleResponsive(element) {
            if (window.innerWidth >= app.breakpointSize) {
                app.component.overlay.close(element);
                element.removeAttribute('inert');
            }
        },
    },

    navbar: {
        toggle: (element) => {
            const isScrolled = window.scrollY > 0;
            element.classList[isScrolled ? 'add' : 'remove']('border-neutral-200', 'dark:border-neutral-800');
            element.classList[isScrolled ? 'remove' : 'add']('border-transparent', 'dark:border-transparent');
        }
    },

    darkMode: {
        toggle(button) {
            const selectedTheme = button.getAttribute('aria-labelledby')?.replace('theme-', '');
            localStorage.theme = selectedTheme;
            this.updateTheme();
            this.updateButton();
            const dropdownId = button.getAttribute('aria-controls');
            const dropdownElement = document.getElementById(dropdownId);
            if (!dropdownElement) return;
            app.component.dropdown.close(dropdownElement);
        }, 
        updateTheme() {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme === 'dark' || 
                (storedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
                (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            app.theme = storedTheme || '';
        },
        updateButton() {
            if (!app.theme) return;
            const activeClasses = ['bg-neutral-100', 'dark:bg-neutral-800'];
            const inactiveClasses = ['hover:bg-neutral-100', 'dark:hover:bg-neutral-800'];
            document.querySelectorAll('[aria-labelledby^="theme"]').forEach(button => {
                button.classList.remove(...activeClasses);
                button.classList.add(...inactiveClasses);
            })
            const activeButton = document.querySelector(`[aria-labelledby="theme-${app.theme}"]`)
            if (activeButton) {
                activeButton.classList.remove(...inactiveClasses);
                activeButton.classList.add(...activeClasses);
            }
        }
    },

    dropdown: {
        toggle(button, isOpen = null) {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);
            if (isOpen == null) isOpen = button.getAttribute('aria-expanded') !== 'true';
            if (!element) return;
            isOpen ? this.open(element) : this.close(element);
        },
        open(element) {
            element.classList.remove('hidden', 'invisible');
            element.removeAttribute('inert');
            this.toggleButton(element.id, true);
            this.addEvents(element);
        },
        close(element) {
            element.classList.add('hidden', 'invisible');
            element.setAttribute('inert', '');
            this.toggleButton(element.id, false);
            this.removeEvents(element)
        },
        toggleButton(id, isOpen) {
            document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
                button.setAttribute('aria-expanded', isOpen);
            });
        },
        addEvents(element) {
            if (this[element.id]) return;
            this[element.id] = {
                clickOutside: (event) => app.component.utility.clickOutsideHandler(this, element, event),
                escapeKey: (event) => app.component.utility.escapeKeyHandler(this, element, event),
            };
            document.addEventListener('click', this[element.id].clickOutside);
            window.addEventListener('keydown', this[element.id].escapeKey);
        },
        removeEvents(element) {
            if (!this[element.id]) return;
            document.removeEventListener('click', this[element.id].clickOutside);
            window.removeEventListener('keydown', this[element.id].escapeKey);
            delete this[element.id];
        }
    },

    overlay: {
        toggle(button, isOpen = null) {
            const id = button.getAttribute('aria-controls');
            const element = document.getElementById(id);
            if (isOpen == null) isOpen = button.getAttribute('aria-expanded') !== 'true';
            if (!element) return;
            isOpen ? this.open(element) : this.close(element);
        },
        open(element) {
            element.classList.remove('hidden', 'invisible');
            element.removeAttribute('inert');
            document.body.classList.add('overflow-hidden');
            app.component.utility.forceFocus(element);
            this.toggleButton(element.id, true);
            this.addEvents(element);
        },
        close(element) {
            element.classList.add('hidden', 'invisible');
            element.setAttribute('inert', '');
            document.body.classList.remove('overflow-hidden');
            this.toggleButton(element.id, false);
            this.removeEvents(element)
        },
        toggleButton(id, isOpen) {
            document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
                button.setAttribute('aria-expanded', isOpen);
            });
        },
        addEvents(element) {
            if (this[element.id]) return;
            this[element.id] = {
                clickOutside: (event) => app.component.utility.clickOutsideHandler(this, element, event),
                escapeKey: (event) => app.component.utility.escapeKeyHandler(this, element, event),
                focusTrap: (event) => app.component.utility.focusTrapHandler(element, event),
            };
            document.addEventListener('click', this[element.id].clickOutside);
            window.addEventListener('keydown', this[element.id].escapeKey);
            window.addEventListener('keydown', this[element.id].focusTrap);
        },
        removeEvents(element) {
            if (!this[element.id]) return;
            document.removeEventListener('click', this[element.id].clickOutside);
            window.removeEventListener('keydown', this[element.id].escapeKey);
            window.removeEventListener('keydown', this[element.id].focusTrap);
            delete this[element.id];
        }
    },

    footer: {
        init: () => {
            if (app.element.footerAppName) app.element.footerAppName.innerHTML = app.name;
            if (app.element.footerAppVersion) app.element.footerAppVersion.innerHTML = app.version;
            if (app.element.footerAppYear) app.element.footerAppYear.innerHTML = new Date().getFullYear();
        }
    },

    utility: {
        forceFocus(element) {
            element.setAttribute('tabindex', 1);
            element.focus();
            setTimeout(() => element.removeAttribute('tabindex'), 100);
        },
        clickOutsideHandler(component, element, event) {
            if (!event.target.closest(`[aria-labelledby="${element.id}"]`) && !event.target.closest(`[aria-controls="${element.id}"]`)) {
                component.close(element);
            }
        },
        escapeKeyHandler(component, element, event) {
            if (event.key === 'Escape') component.close(element);
        },
        focusTrapHandler: (element, event) => {
            if (event.key === 'Tab') {
                const focusableElements = Array.from(element.querySelectorAll('a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]')).filter((focusableElement) => {
                    return focusableElement.offsetParent !== null
                });
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                if (event.shiftKey && (document.activeElement === firstElement || document.activeElement === document.body)) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    } 
}

app.event = {
    document: {
        click: event => {
            let targetElement = event.target.closest('[id]');
            if (targetElement) {
                switch (targetElement.id) {
                    case app.element.sidebarOpenButton?.id:
                        app.component.sidebar.open(app.element.sidebarOpenButton);
                        break;
                    case app.element.sidebarCloseButton?.id:
                        app.component.sidebar.close(app.element.sidebarCloseButton);
                        break;
                    case app.element.notificationsMenuToggleButton?.id:
                        app.component.dropdown.toggle(app.element.notificationsMenuToggleButton);
                        break;
                    case app.element.darkModeMenuToggleButton?.id:
                        app.component.dropdown.toggle(app.element.darkModeMenuToggleButton);
                        break;
                    case app.element.navbarMenuToggleButton?.id:
                        app.component.dropdown.toggle(app.element.navbarMenuToggleButton);
                        break;    
                    case app.element.themeLightButton?.id:
                    case app.element.themeDarkButton?.id:
                    case app.element.themeSystemButton?.id:
                        app.component.darkMode.toggle(targetElement);
                        break;
                    default:
                }
            }
        }
    },

    window: {
        resize: () => {
            if (app.element.sidebar) app.component.sidebar.toggleResponsive(app.element.sidebar);
        },
        scroll: () => {
            if (app.element.navbar) app.component.navbar.toggle(app.element.navbar);
        },
        load: () => {
            if (app.element.navbar) app.component.navbar.toggle(app.element.navbar);
            app.component.darkMode.updateTheme();
            app.component.darkMode.updateButton();
            app.component.footer.init();
        }
    },
    
    init: () => {
        document.addEventListener('click', app.event.document.click);
        window.addEventListener('resize', app.event.window.resize);
        window.addEventListener('scroll', app.event.window.scroll);
        window.addEventListener('load', app.event.window.load);
    }
},

app.init = () => {
    app.event.init();
}

app.init();