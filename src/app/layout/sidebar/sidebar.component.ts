import { Component, ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';
import {SettingsService} from "../../_services/settings.service";

declare let jQuery: any;

@Component({
  selector: '[sidebar]',
  templateUrl: './sidebar.template.html'
})
export class Sidebar {
  sidebarHeight: number = 0;
  sidebarMenu: any = 0;

  position = '';

  menus: any = [{
      icon: 'fa fa-home',
      name: 'หน้าหลัก',
      rout: 'home',
      role: 'ALL'
  },{
      icon: 'fa fa-user',
      name: 'สมัครสมาชิก',
      rout: 'register',
      role: 'ALL'
  },{
    icon: 'fa fa-user',
    name: 'ย้ายสมาชิก',
    rout: 'register-transfer',
    role: 'SUPER_ADMIN'
  },{
      icon: 'fa fa-list-alt',
      name: 'ถอนเงิน',
      rout: 'withdraw',
      role: 'ALL'
  },{
      icon: 'fa fa-user',
      name: 'รายงานสมาชิก',
      rout: 'customer-report',
      role: 'ALL'
  },{
      icon: 'fa fa-list-alt',
      name: 'รายงานการฝาก',
      rout: 'deposit-report',
      role: 'ALL'
  },{
      icon: 'fa fa-list-alt',
      name: 'รายงานที่ถูกซ่อน',
      rout: 'report-hide',
      role: 'SUPER_ADMIN'
  },{
      icon: 'fa fa-user',
      name: 'พนักงาน',
      rout: 'employee',
      role: 'SUPER_ADMIN'
  },{
      icon: 'fa fa-bank',
      name: 'ธนาคาร',
      rout: 'bank',
      role: 'SUPER_ADMIN'
  },{
      icon: 'fa fa-user',
      name: 'รายงานตามสมาชิก',
      rout: 'account-report',
      role: 'SUPER_ADMIN'
  },{
      icon: 'fa fa-list-alt',
      name: 'จัดการโปรโมชั่น',
      rout: 'promotion',
      role: 'SUPER_ADMIN'
  },{
      icon: 'fa fa-user',
      name: 'ลิงค์สมัครสมาชิก',
      rout: 'registbyagent',
      role: 'SUPER_ADMIN'
  }];

  constructor(private renderer: Renderer2, private el: ElementRef, public settings: SettingsService) {
      this.position = this.settings.getPosition();
  }

  ngAfterViewInit() {
    this.sidebarMenu = this.el.nativeElement.querySelector('#side-nav');
    if (window.innerWidth > 768) {
      setTimeout(() => {
        jQuery(this.sidebarMenu).find('.accordion-group.active .accordion-body').collapse('show');
      });
    }
  }

  setSidebarHeight(event) {
    if (window.innerWidth < 768) {
      let sidebarMarginTop = parseInt(
        window.getComputedStyle(this.sidebarMenu).marginTop, 10
      );
      let sidebarMarginBottom = parseInt(
        window.getComputedStyle(this.sidebarMenu).marginBottom, 10
      );
      this.sidebarHeight = this.sidebarMenu.offsetHeight + sidebarMarginTop + sidebarMarginBottom;
      let closestAccordionGroup = event.target.closest('.accordion-group');
      let submenuHeight = 0;
      let submenuItems = closestAccordionGroup.querySelectorAll('ul > li');
      submenuItems.forEach(() => {
        submenuHeight += 26;
      });
      let expandedMenu = closestAccordionGroup
        .querySelector('.accordion-body')
        .getAttribute('aria-expanded');
      if (expandedMenu === 'false') {
        this.sidebarHeight += submenuHeight;
      } else {
        this.sidebarHeight -= submenuHeight;
      }
    }
  }

  collapseSubMenu(event) {
    let currentMenu = event.target
      .closest('.accordion-group')
      .querySelector('.accordion-body');
    let collapsingMenu = this.sidebarMenu
      .querySelector('.accordion-group .accordion-body.collapse.show');
    jQuery(collapsingMenu).collapse('hide');
    jQuery(currentMenu).collapse('show');
    if (collapsingMenu && currentMenu !== collapsingMenu && window.innerWidth < 768) {
      let submenuHeight = 0;
      let submenuItems = collapsingMenu.querySelectorAll('li');
      submenuItems.forEach(() => {
        submenuHeight += 26;
      });
      this.sidebarHeight -= submenuHeight;
    }
  }

  sidebarBehavior(event) {
    this.setSidebarHeight(event);
    this.collapseSubMenu(event);
    this.renderer.setStyle(document
      .querySelector('.content'), 'margin-top', this.sidebarHeight + 'px');
  }
}
