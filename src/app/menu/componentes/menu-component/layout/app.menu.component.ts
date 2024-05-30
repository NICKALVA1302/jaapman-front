import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/menu/dashboard'] }
                ]
            },
            {
                label: 'HISTORIA',
                items: [
                    {
                        label: 'Comuna Manglaralto', icon: 'pi pi-fw pi-heart-fill', routerLink: ['history']
                    },
                    {
                        label: 'JAAPMAN', icon: 'pi pi-fw pi-star',  routerLink: ['company']
                    }
                ]
            },
            {
                label: 'INGRESOS',
                items: [
                    { label: 'Ingresar Usuario', icon: 'pi pi-fw pi-user-plus', routerLink: ['enter-user'] },
                    { label: 'Ingresar Materiales', icon: 'pi pi-fw pi-check-square', routerLink: ['enter-materials'] },
                    { label: 'Ingresar Clientes', icon: 'pi pi-fw pi-user-plus', routerLink: ['enter-clients'] },
                    { label: 'Ingresar Categorías', icon: 'pi pi-fw pi-tags', routerLink: ['enter-categories'] },
                    { label: 'Ingresar Tarifa de Descuento', icon: 'pi pi-fw pi-dollar', routerLink: ['enter-discount'] },
                ]
            },
            {
                label: 'SERVICIOS',
                items: [
                    {
                        label: 'Materiales',
                        icon: 'pi pi-fw pi-briefcase',
                        items: [
                            { label: 'Opción 1', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 2', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 3', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 4', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] }
                        ]
                    },

                    {
                        label: 'Consumo de Agua',
                        icon: 'pi pi-fw pi-chart-bar    ',
                        items: [
                            { label: 'Opción 1', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 2', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 3', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 4', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] }
                        ]
                    },

                    {
                        label: 'Multas',
                        icon: 'pi pi-fw pi-exclamation-triangle',
                        items: [
                            { label: 'Opción 1', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 2', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 3', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 4', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] }
                        ]
                    },

                    {
                        label: 'Derechos de Instalación',
                        icon: 'pi pi-fw pi-ticket',
                        items: [
                            { label: 'Opción 1', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 2', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 3', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 4', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] }
                        ]
                    },

                    { label: 'Cobros', icon: 'pi pi-fw pi-money-bill', routerLink: ['collections'] },
                    { label: 'Suspención', icon: 'pi pi-fw pi-ban', routerLink: ['suspension'] },

                    {
                        label: 'Alcantarillado',
                        icon: 'pi pi-fw pi-filter-fill',
                        items: [
                            { label: 'Opción 1', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 2', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 3', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 4', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] }
                        ]
                    },

                    {
                        label: 'Descuento',
                        icon: 'pi pi-fw pi-dollar',
                        items: [
                            { label: 'Opción 1', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 2', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 3', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                            { label: 'Opción 4', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] }
                        ]
                    },
                ]
            },
            {
                label: 'SRI',
                items: [
                    { label: 'Envío de Comprobantes', icon: 'pi pi-fw pi-file-export', routerLink: ['sending-receipts'] },
                    { label: 'Envío de Correos', icon: 'pi pi-fw pi-send', routerLink: ['sending-mails'] },
                    { label: 'Configuración', icon: 'pi pi-fw pi-cog', routerLink: ['setting'] },
                ]
            },
            {
                label: 'PERMISOS',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    { label: 'Opción 1', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                    { label: 'Opción 2', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                    { label: 'Opción 3', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                    { label: 'Opción 4', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                ]
            },
            {
                label: 'REPORTES',
                items: [
                    { label: 'Opción 1', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                    { label: 'Opción 2', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                    { label: 'Opción 3', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                    { label: 'Opción 4', icon: 'pi pi-fw pi-cog', routerLink: ['pages/empty'] },
                ]
            },
            {
                label: 'INFORMACIÓN',
                items: [
                    {
                        label: 'Información del Sistema', icon: 'pi pi-fw pi-info-circle', routerLink: ['documentation']
                    },
                    {
                        label: 'Opción Adicional', icon: 'pi pi-fw pi-github', url: ['https://facebook.com'], target: '_blank'
                    }
                ]
            },
            {
                label: 'XD',
                items: [
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['auth/access']
                            }
                        ]
                    },
                ]
            }
        ];
    }
}
