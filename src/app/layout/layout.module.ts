import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatListModule }     from '@angular/material/list';
import { MatButtonModule }   from '@angular/material/button';
import { MatIconModule }     from '@angular/material/icon';
import { MatDividerModule }  from '@angular/material/divider';
import { MatTooltipModule }  from '@angular/material/tooltip';
import { CommonModule }      from '@angular/common';
import { ShellComponent }    from './shell/shell.component';

@NgModule({
  declarations: [ShellComponent],
  imports: [
    CommonModule, RouterModule,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule,
  ],
  exports: [ShellComponent],
})
export class LayoutModule {}
