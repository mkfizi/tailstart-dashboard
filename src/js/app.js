/**
 * --------------------------------------------------------------------------
 * Tailstart - Dashboard v0.1.0: app.js
 * Licensed under MIT (https://github.com/mkfizi/dashboard/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

(function () {
    'use strict';

    const app = {};

    app.name = 'Tailstart - Dashboard';
    app.version = '0.1.0';
    app.breakpointSize = 1024;

    app.element = {
        navbar: document.getElementById('navbar'),
        sidebarMenu: document.getElementById('sidebar-menu'),
        sidebarMenuOpen: document.getElementById('sidebar-menu-open'),
        sidebarMenuClose: document.getElementById('sidebar-menu-close'),
        sidebarMenuAccordionToggles: document.querySelectorAll('[data-accordion="sidebar-menu"]'),
        darkModeToggle: document.getElementById('dark-mode-toggle'),
        settingsMenu: document.getElementById('settings-menu'),
        settingsMenuToggle: document.getElementById('settings-menu-toggle'),
        notificationsMenu: document.getElementById('notifications-menu'),
        notificationsMenuToggle: document.getElementById('notifications-menu-toggle'),
        footerCurrentYear: document.getElementById('footer-year'),
        footerAppName: document.getElementById('footer-app-name'),
        footerAppVersion: document.getElementById('footer-app-version'),
    }

    app.view = {

        viewportHeight: {

            // Workaround fix to handle viewport height issue on mobile browsers
            // https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser
            toggle: () => {
                document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
            }
        },

        navbar: {

            // Toggle navbar appearance base on window scroll Y position
            toggle: () => {
                if (app.element.navbar) {
                    const isScrolled = window.scrollY > 0;
                    app.element.navbar.classList[isScrolled ? 'add' : 'remove']('border-neutral-200', 'dark:border-neutral-800', 'shadow');
                    app.element.navbar.classList[isScrolled ? 'remove' : 'add']('border-transparent', 'dark:border-transparent');
                }
            },
        },

        menu: {

            // Open menu
            open: (targetElement) => app.view.menu.toggle(targetElement, true),

            // Close menu
            close: (targetElement) => app.view.menu.toggle(targetElement, false),
        
            // Toggle menu
            toggle: (targetElement, isOpen) => {
                targetElement.classList[isOpen ? 'remove' : 'add']('hidden', 'invisible');
                targetElement.setAttribute('aria-hidden', !isOpen);

                // Set toggle element `[aria-expanded]` attribute value
                document.querySelectorAll(`[aria-controls='${targetElement.id}']`).forEach((currentToggleElement) => {
                    currentToggleElement.setAttribute('aria-expanded', isOpen);
                });
            },

            // Force focus on element before initialize focus trap
            forceFocus: (targetElement) => {
                targetElement.setAttribute('tabindex', 1);
                targetElement.focus();
                setTimeout(() => {
                    targetElement.removeAttribute('tabindex');
                }, 100);
            },

            // Click outside handler
            clickOutside: (targetView, targetElement, event) => {

                // Check if closest element to `event.target` is not the element where its `[aria-labelledby]`
                // or `[aria-controls]` values does not equal to `targetElement.id` value
                if (!event.target.closest(`[aria-labelledby="${targetElement.id}"]`) && !event.target.closest(`[aria-controls="${targetElement.id}"]`)) {
                    targetView.close(targetElement);
                }
            },

            // Escape key handler
            escape: (targetView, targetElement, event) => {
                if (event.key === 'Escape') {
                    targetView.close(targetElement);
                }
            },

            // Focus trap handler
            focusTrap: (targetElement, event) => {
                if (event.key === 'Tab') {
                    const focusableElements = Array.from(targetElement.querySelectorAll('a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]')).filter(currentElement => {
                        return !currentElement.closest('[tabindex="-1"], .hidden, .invisible') || null;
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
            },

            sidebar: {

                // Open sidebar menu
                open: () => {
                    if (app.element.sidebarMenu) {
                        app.view.menu.open(app.element.sidebarMenu);
                        app.view.menu.forceFocus(app.element.sidebarMenu);
    
                        app.view.menu.sidebar.clickOutside = (event) => app.view.menu.clickOutside(app.view.menu.sidebar, app.element.sidebarMenu, event)
                        app.view.menu.sidebar.escape = (event) => app.view.menu.escape(app.view.menu.sidebar, app.element.sidebarMenu, event)
                        app.view.menu.sidebar.focusTrap = (event) => app.view.menu.focusTrap(app.element.sidebarMenu, event)
    
                        window.addEventListener('click', app.view.menu.sidebar.clickOutside);
                        window.addEventListener('keydown', app.view.menu.sidebar.escape);
                        window.addEventListener('keydown', app.view.menu.sidebar.focusTrap);
                    }
                },

                // Close navbar menu
                close: () => {
                    if (app.element.sidebarMenu) {
                        app.view.menu.close(app.element.sidebarMenu);

                        window.removeEventListener('click', app.view.menu.sidebar.clickOutside);
                        window.removeEventListener('keydown', app.view.menu.sidebar.escape);
                        window.removeEventListener('keydown', app.view.menu.sidebar.focusTrap);
                    }
                },

                // Handle when switching view between breakpoint size
                toggleResponsive: () => {
                    if (app.element.sidebarMenu) {

                        // If window width past breakpoint size, close menu and remove `[aria-hidden]` attribute from it
                        if (window.innerWidth >= app.breakpointSize) {
                            if (app.element.sidebarMenu.getAttribute('aria-hidden') === 'false') {
                                app.view.menu.navbar.close();
                            }

                            app.element.sidebarMenu.removeAttribute('aria-hidden');
                        } else {
                            if (!app.element.sidebarMenu.getAttribute('aria-hidden')) {
                                app.element.sidebarMenu.setAttribute('aria-hidden', true);
                            }
                        }
                    }
                },

                accordion: {

                    // Toggle accordion
                    toggle: (accordionToggle, isOpen = null) => {
                        const id = accordionToggle.getAttribute("aria-controls");
                        const targetElement = document.getElementById(id);

                        if (targetElement) {
                            if (isOpen == null) {
                                isOpen = targetElement.getAttribute('aria-hidden') === "true" || false;
                            }

                            targetElement.classList[isOpen ? 'remove' : 'add']('hidden', 'invisible');
                            targetElement.setAttribute('aria-hidden', !isOpen);

                            // Set toggle element `[aria-expanded]` attribute value
                            document.querySelectorAll(`[aria-controls="${id}"]`).forEach(toggleElement => {
                                toggleElement.setAttribute('aria-expanded', isOpen);
                            });

                            // Rotate icon element
                            document.querySelectorAll(`[aria-labelledby="${id}"]`).forEach(iconElement => {
                                iconElement.classList.toggle('rotate-180', isOpen);
                            });

                            // Close other accordions
                            if (isOpen) {
                                app.element.sidebarMenuAccordionToggles.forEach(accordionToggle => {
                                    const accordionId = accordionToggle.getAttribute('aria-controls');
                                    const targetAccordion = document.getElementById(accordionId)

                                    if (targetAccordion && targetAccordion !== targetElement) {
                                        app.view.menu.sidebar.accordion.toggle(accordionToggle, false);
                                    }
                                })
                            }
                        }
                    }
                }
            },

            notifications: {

                // Open notifications menu
                open: () => {
                    if (app.element.notificationsMenu) {
                        app.view.menu.open(app.element.notificationsMenu);

                        app.view.menu.notifications.clickOutside = (event) => app.view.menu.clickOutside(app.view.menu.notifications, app.element.notificationsMenu, event)
                        app.view.menu.notifications.escape = (event) => app.view.menu.escape(app.view.menu.notifications, app.element.notificationsMenu, event)

                        window.addEventListener('click', app.view.menu.notifications.clickOutside);
                        window.addEventListener('keydown', app.view.menu.notifications.escape);
                    }
                },

                // Close notifications menu
                close: () => {
                    if (app.element.notificationsMenu) {
                        app.view.menu.close(app.element.notificationsMenu);

                        window.removeEventListener('click', app.view.menu.notifications.clickOutside);
                        window.removeEventListener('keydown', app.view.menu.notifications.escape);
                    }
                },

                // Toggle notifications menu
                toggle: () => {
                    if (app.element.notificationsMenu) {
                        let isOpen = (app.element.notificationsMenu.getAttribute('aria-hidden') === 'true');

                        isOpen 
                            ? app.view.menu.notifications.open()
                            : app.view.menu.notifications.close();
                    }
                },
            },


            settings: {

                // Open settings menu
                open: () => {
                    if (app.element.settingsMenu) {
                        app.view.menu.open(app.element.settingsMenu);

                        app.view.menu.settings.clickOutside = (event) => app.view.menu.clickOutside(app.view.menu.settings, app.element.settingsMenu, event)
                        app.view.menu.settings.escape = (event) => app.view.menu.escape(app.view.menu.settings, app.element.settingsMenu, event)

                        window.addEventListener('click', app.view.menu.settings.clickOutside);
                        window.addEventListener('keydown', app.view.menu.settings.escape);
                    }
                },

                // Close settings menu
                close: () => {
                    if (app.element.settingsMenu) {
                        app.view.menu.close(app.element.settingsMenu);

                        window.removeEventListener('click', app.view.menu.settings.clickOutside);
                        window.removeEventListener('keydown', app.view.menu.settings.escape);
                    }
                },

                // Toggle settings menu
                toggle: () => {
                    if (app.element.settingsMenu) {
                        let isOpen = (app.element.settingsMenu.getAttribute('aria-hidden') === 'true');

                        isOpen 
                            ? app.view.menu.settings.open()
                            : app.view.menu.settings.close();
                    }
                },
            }
        },

        darkMode: {

            // Toggle dark mode
            toggle: () => {
                const isDarkMode = localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches);
                localStorage.theme = isDarkMode ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark', isDarkMode);
            }
        },

        footer: {

            // Initialize footer content with current year, app name and version
            init: () => {
                if (app.element.footerCurrentYear) {
                    app.element.footerCurrentYear.innerHTML = new Date().getFullYear();
                }

                if (app.element.footerAppName) {
                    app.element.footerAppName.innerHTML = app.name;
                }

                if (app.element.footerAppVersion) {
                    app.element.footerAppVersion.innerHTML = app.version;
                }
            }
        },

        // Initialize view
        init: () => {
            app.view.viewportHeight.toggle();
            app.view.footer.init();
            app.view.menu.sidebar.toggleResponsive();
        }
    }

    app.event = {
        document: {

            // Handle document 'click' event by attaching a global click event listener instead of applying it on every clickable elements
            click: event => {
                let targetElement = event.target.closest('[id]');
                if (targetElement) {

                    // Delegate method calls using switch case on element id
                    switch (targetElement.id) {
                        case app.element.darkModeToggle?.id:
                            app.view.darkMode.toggle();
                            break;

                        case app.element.sidebarMenuOpen?.id:
                            app.view.menu.sidebar.open();
                            break;

                        case app.element.sidebarMenuClose?.id:
                            app.view.menu.sidebar.close();
                            break;

                        case app.element.settingsMenuToggle?.id:
                            app.view.menu.settings.toggle();
                            break;

                        case app.element.notificationsMenuToggle?.id:
                            app.view.menu.notifications.toggle();
                            break;

                        default:
                            app.element.sidebarMenuAccordionToggles.forEach((accordionToggle) => {
                                if (targetElement.id == accordionToggle.id) {
                                    app.view.menu.sidebar.accordion.toggle(accordionToggle);
                                }
                            })
                    }

                }
            }
        },

        window: {
            
            // Handle window 'resize' event
            resize: () => {
                app.view.viewportHeight.toggle();
                app.view.menu.sidebar.toggleResponsive();
            },

            // Handle window 'scroll' event
            scroll: () => {
                app.view.navbar.toggle();
            }
        },

        init: () => {
            document.addEventListener('click', app.event.document.click);
            window.addEventListener('resize', app.event.window.resize);
            window.addEventListener('scroll', app.event.window.scroll);
        }
    },

    app.init = () => {
        app.view.init();
        app.event.init();
    }

    app.init();
})();