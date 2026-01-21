import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavigationService, Module, SubModule, Screen } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  modules: Module[] = [];
  selectedModule: Module | null = null;
  selectedSubModule: SubModule | null = null;
  selectedScreen: Screen | null = null;
  sidebarCollapsed: boolean = false;
  username: string = '';
  expandedSubModules: Set<string> = new Set();

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modules = this.navigationService.getModules();
    this.username = this.authService.getUsername();

    // --- Default sidebar with dashboard ---
const defaultModule = this.modules.find(m => m.name.toLowerCase() === 'accounts');
if (defaultModule) {
  this.selectedModule = defaultModule;
  this.navigationService.selectModule(defaultModule);
  if (defaultModule.subModules && defaultModule.subModules.length > 0) {
    const firstSubModule = defaultModule.subModules[0];
    this.expandedSubModules.add(firstSubModule.id);
    this.selectedSubModule = firstSubModule;
    this.navigationService.selectSubModule(firstSubModule);
  }
}

let dashboardScreen: Screen | undefined;
for (const module of this.modules) {
  for (const subModule of module.subModules || []) {
    const foundScreen = subModule.screens?.find(screen => screen.name.toLowerCase() === 'dashboard');
    if (foundScreen) {
      dashboardScreen = foundScreen;
      break;
    }
  }
  if (dashboardScreen) break;
}
if (dashboardScreen) {
  this.selectedScreen = dashboardScreen;
  this.navigationService.selectScreen(dashboardScreen);
  this.router.navigate([dashboardScreen.route]);
}
  // --- Default sidebar with dashboard ---


    this.navigationService.selectedModule$.subscribe(module => {
      this.selectedModule = module;
    });

    this.navigationService.selectedSubModule$.subscribe(subModule => {
      this.selectedSubModule = subModule;
    });

    this.navigationService.selectedScreen$.subscribe(screen => {
      this.selectedScreen = screen;
    });
  }

  selectModule(module: Module): void {
    this.navigationService.selectModule(module);
    this.expandedSubModules.clear();
  }

  toggleSubModule(subModule: SubModule): void {
    if (this.expandedSubModules.has(subModule.id)) {
      this.expandedSubModules.delete(subModule.id);
    } else {
      this.expandedSubModules.add(subModule.id);
    }
    this.navigationService.selectSubModule(subModule);
  }

  isSubModuleExpanded(subModuleId: string): boolean {
    return this.expandedSubModules.has(subModuleId);
  }

  selectScreen(screen: Screen): void {
    this.navigationService.selectScreen(screen);
    this.router.navigate([screen.route]);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
