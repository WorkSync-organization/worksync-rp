import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.css',
  imports: [NavbarComponent],
})
export class ViewProjectComponent implements OnInit {
  projectId!: string;

  constructor(public router: ActivatedRoute) {}
  ngOnInit(): void {
    this.projectId = this.router.snapshot.paramMap.get('projectId')!;
  }
}
