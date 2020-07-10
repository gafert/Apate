import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/cmake/cmake';
import 'codemirror/mode/meta';

if (AppConfig.production) {
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule, {
		preserveWhitespaces: false,
	})
	.then((ref) => {
		// Otherwise, log the boot error
	})
	.catch((err) => console.error(err));
