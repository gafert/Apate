import { Component } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import Prism from 'prismjs';

@Component({
  selector: 'app-demo-project-description',
  templateUrl: './demo-project-description.component.html',
  styleUrls: ['./demo-project-description.component.scss']
})
export class DemoProjectDescriptionComponent {
  public styledCode = "";

  constructor(public project: ProjectService) {
    this.styledCode = Prism.highlight(this.project.getDemoFileContents(), Prism.languages.javascript, 'javascript')
  }

}
