import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';
import { MENU } from './menu';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  breadCrumbService = inject(BreadcrumbService)

  readonly menus = MENU;

  isSideNavCollapsed = signal<boolean>(false);
  isSmallDevice = signal<boolean>(false);
  expandedMenu = signal<Map<number, boolean>>(new Map());
  currentUrl = signal(this.router.url)

  ngOnInit(): void {
    this.windowResize();
    this.checkScreenSize();
    this.onRouteChange();
    this.updateBreadCrumb()
    this.expandCurrentMenu()
  }

  windowResize() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(50))
      .subscribe(() => this.checkScreenSize());
  }

  onRouteChange() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.url)
        this.updateBreadCrumb()
      }
    });
  }

  expandCurrentMenu(){
    const index = this.menus.findIndex(menu => {
      return menu.children.find(childMenu => this.getPathFromUrl(this.currentUrl()).startsWith(`/${childMenu.path}`));
    });

    this.expandedMenu.update((expandedMenu) =>
      expandedMenu.set(index, !expandedMenu.get(index))
    );
  }

  updateBreadCrumb() {
    const currentRoute = this.getChild(this.activatedRoute);
    currentRoute.data.subscribe(data => {
      this.breadCrumbService.updateBreadCrumbTitle(data["title"])
    });
  }

  getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  isActiveLink(url: string) {
    return this.getPathFromUrl(this.currentUrl()).startsWith(`/${url}`)
  }

  getPathFromUrl(url: string) {
    return url.split('?')[0];
  }

  checkScreenSize() {
    const largerDeviceWidth = 992;
    const screenWidth = window.innerWidth;
    this.isSmallDevice.set(screenWidth < largerDeviceWidth);
    this.isSideNavCollapsed.set(screenWidth < largerDeviceWidth);
  }

  toggleSideNav() {
    this.isSideNavCollapsed.update((value) => !value);
  }

  toggleMenu(index: number) {
    this.expandedMenu.update((expandedMenu) =>
      expandedMenu.set(index, !expandedMenu.get(index))
    );
  }

  clickMenu(event: any, menu: any, index: number) {
    event.preventDefault();
    if (menu.children?.length) {
      this.toggleMenu(index);
    } else {
      this.router.navigate([menu.path]);
      if (this.isSmallDevice()) {
        this.toggleSideNav();
      }
    }
  }
}
