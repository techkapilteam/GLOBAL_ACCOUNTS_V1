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
  sidebarCollapsed: boolean = true; // ✅ FIX 1: Start collapsed — no auto-open on login
  username: string = '';
  expandedSubModules: Set<string> = new Set();

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.modules = this.navigationService.getModules();
    this.username = this.authService.getUsername();

    // ✅ FIX 2: Removed ALL auto-selection logic from here.
    // Do NOT auto-select module/submodule/screen on login.
    // User should land on a blank/welcome state.

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
    if (this.selectedModule?.id === module.id) {
      // ✅ FIX 3: Clicking same module toggles the sidebar open/close
      this.sidebarCollapsed = !this.sidebarCollapsed;
    } else {
      // New module selected — open sidebar, clear old submodule selections
      this.selectedSubModule = null;
      this.selectedScreen = null;
      this.expandedSubModules.clear();
      this.navigationService.selectModule(module);
      this.sidebarCollapsed = false; // ✅ Open sidebar when new module clicked
    }
  }

  toggleSubModule(subModule: SubModule): void {
    // ✅ FIX 4: Open sidebar if it's collapsed when submodule clicked
    if (this.sidebarCollapsed) {
      this.sidebarCollapsed = false;
    }

    if (this.expandedSubModules.has(subModule.id)) {
      // Clicking same submodule collapses its flyout
      this.expandedSubModules.delete(subModule.id);
    } else {
      // New submodule — clear others, expand this one
      this.expandedSubModules.clear();
      this.expandedSubModules.add(subModule.id);
      this.navigationService.selectSubModule(subModule);
    }
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

    if (this.sidebarCollapsed) {
      // Closing — collapse flyout too
      this.expandedSubModules.clear();
    } else {
      // Opening via hamburger — auto-select first module if none selected
      if (!this.selectedModule && this.modules.length > 0) {
        this.navigationService.selectModule(this.modules[0]);
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}