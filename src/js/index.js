'use strict';

(function () {
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
    }

    app.component = {
        navbar: {
            toggle: (element) => {
                const isScrolled = window.scrollY > 0;
                element.classList[isScrolled ? 'add' : 'remove']('border-neutral-200', 'dark:border-neutral-800');
                element.classList[isScrolled ? 'remove' : 'add']('border-transparent', 'dark:border-transparent');
            },

            toggleResponsive: (element) => {
                if (window.innerWidth >= app.breakpointSize) {
                    const id = element.getAttribute('aria-labelledby');
                    const navbarMenu = document.getElementById(id);

                    if (!navbarMenu) return;
                    app.component.navbar.menu.close(navbarMenu);
                }
            },
        },

        darkMode: {
            theme: '',
    
            toggle: (button) => {
                const selectedTheme = button.getAttribute("aria-labelledby")?.replace("theme-", "");
                localStorage.theme = selectedTheme;
                app.component.darkMode.updateTheme();
                app.component.darkMode.updateButton();
                
                const dropdownId = button.getAttribute('aria-controls');
                const dropdownElement = document.getElementById(dropdownId);
                if (dropdownElement) {
                    app.component.dropdown.close(dropdownElement);
                }
            },
            
            updateTheme: () => {
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
            
            updateButton: () => {
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
            },
        },

        offcanvas: {
            open: (element) => {
                element.classList.remove('hidden', 'invisible');
                element.removeAttribute('inert');
                app.component.utility.forceFocus(element);
                app.component.offcanvas.toggleButton(element.id, true);
                
                if (app.component.offcanvas[element.id]) return;
                app.component.offcanvas[element.id] = {
                    clickOutside: (event) => app.component.utility.clickOutsideHandler(app.component.offcanvas, element, event),
                    escapeKey: (event) => app.component.utility.escapeKeyHandler(app.component.offcanvas, element, event),
                    focusTrap: (event) => app.component.utility.focusTrapHandler(element, event)
                };
                document.addEventListener('click', app.component.offcanvas[element.id].clickOutside);
                window.addEventListener('keydown', app.component.offcanvas[element.id].escapeKey);
                window.addEventListener('keydown', app.component.offcanvas[element.id].focusTrap);
            },
    
            close: (element) => {
                element.classList.add('hidden', 'invisible');
                element.setAttribute('inert', '');
                app.component.offcanvas.toggleButton(element.id, false);
    
                if (!app.component.offcanvas[element.id]) return;
                document.removeEventListener('click', app.component.offcanvas[element.id].clickOutside);
                window.removeEventListener('keydown', app.component.offcanvas[element.id].escapeKey);
                window.removeEventListener('keydown', app.component.offcanvas[element.id].focusTrap);
                delete app.component.offcanvas[element.id];
            },
    
            toggleButton: (id, isOpen) => {
                document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
                    button.setAttribute('aria-expanded', isOpen);
                });
            },
        },

        dropdown: {
            toggle: (button) => {
                const id = button.getAttribute('aria-controls');
                const element = document.getElementById(id);
                const isOpen = button.getAttribute('aria-expanded') === 'true';
    
                if (!element) return;
                isOpen ? app.component.dropdown.close(element) : app.component.dropdown.open(element);
            },
    
            open: (element) => {
                element.classList.remove('hidden', 'invisible');
                element.removeAttribute('inert');
                app.component.dropdown.toggleButton(element.id, true);
                
                if (app.component.dropdown[element.id]) return;
                app.component.dropdown[element.id] = {
                    clickOutside: (event) => app.component.utility.clickOutsideHandler(app.component.dropdown, element, event),
                    escapeKey: (event) => app.component.utility.escapeKeyHandler(app.component.dropdown, element, event)
                };
                document.addEventListener('click', app.component.dropdown[element.id].clickOutside);
                window.addEventListener('keydown', app.component.dropdown[element.id].escapeKey);
            },
    
            close: (element) => {
                element.classList.add('hidden', 'invisible');
                element.setAttribute('inert', '');
                app.component.dropdown.toggleButton(element.id, false);
    
                if (!app.component.dropdown[element.id]) return;
                document.removeEventListener('click', app.component.dropdown[element.id].clickOutside);
                window.removeEventListener('keydown', app.component.dropdown[element.id].escapeKey);
                delete app.component.dropdown[element.id];
            },
    
            toggleButton: (id, isOpen) => {
                document.querySelectorAll(`[aria-controls="${id}"]`).forEach(button => {
                    button.setAttribute('aria-expanded', isOpen);
                });
            },
        },

        sidebar: {
            toggleResponsive: (element) => {
                if (window.innerWidth >= app.breakpointSize) {
                    app.component.sidebar.close(element);
                }
            },

            open: (element) => {
                app.component.offcanvas.open(element);
                document.body.classList.add("overflow-hidden");
                element.removeAttribute('inert');
            },

            close: (element) => {
                app.component.offcanvas.close(element);
                document.body.classList.remove("overflow-hidden");
                element.removeAttribute('inert');
            }
        },

        utility: {
            forceFocus: (element) => {
                element.setAttribute('tabindex', 1);
                element.focus();
                setTimeout(() => {
                    element.removeAttribute('tabindex');
                }, 100);
            },
    
            clickOutsideHandler: (component, element, event) => {
                console.log(component, element, event)
                if (!event.target.closest(`[aria-labelledby="${element.id}"]`) && !event.target.closest(`[aria-controls="${element.id}"]`)) {
                    component.close(element);
                }
            },
    
            escapeKeyHandler: (component, element, event) => {
                if (event.key === 'Escape') {
                    component.close(element);
                }
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
                            app.component.sidebar.open(app.element.sidebar);
                            break;
                        case app.element.sidebarCloseButton?.id:
                            app.component.sidebar.close(app.element.sidebar);
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
                if (app.element.navbar) app.component.navbar.toggleResponsive(app.element.navbar);
                if (app.element.sidebar) app.component.sidebar.toggleResponsive(app.element.sidebar);
            },
            scroll: () => {
                if (app.element.navbar) app.component.navbar.toggle(app.element.navbar);
            },
            load: () => {
                if (app.element.navbar) app.component.navbar.toggle(app.element.navbar);

                app.component.darkMode.updateTheme();
                app.component.darkMode.updateButton();
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
})();