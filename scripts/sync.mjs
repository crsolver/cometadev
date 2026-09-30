// Actualiza la copia de los datos del compilador (docs, specs, ejemplos, gramática y biblioteca estándar).
// Uso: npm run sync [-- ruta/al/repo/cometa]   (por defecto ../cometa; también COMETA_REPO)
import { cpSync, copyFileSync, rmSync, mkdirSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const repo = resolve(process.argv[2] ?? process.env.COMETA_REPO ?? '../cometa');

function copiarMd(origen, destino) {
	mkdirSync(destino, { recursive: true });
	for (const f of readdirSync(destino)) if (f.endsWith('.md')) rmSync(`${destino}/${f}`);
	for (const f of readdirSync(origen)) if (f.endsWith('.md')) copyFileSync(`${origen}/${f}`, `${destino}/${f}`);
}

copiarMd(`${repo}/docs`, 'src/content/guias');
copyFileSync(`${repo}/specs.md`, 'src/content/referencia/specs.md');
rmSync('src/programas', { recursive: true, force: true });
cpSync(`${repo}/examples`, 'src/programas', { recursive: true });
copyFileSync(`${repo}/vscode-extension/syntaxes/cometa.tmLanguage.json`, 'src/lib/cometa.tmLanguage.json');

// La referencia de la biblioteca estándar se genera con Go: cmd/gendocs escribe webpage/src/data/biblioteca.json
// dentro del repo del compilador y aquí se copia el resultado.
// En esta máquina hay dos instalaciones de Go y una falla; se prueban en orden.
const candidatos = [process.env.GO, 'C:/Program Files/Go/bin/go.exe', 'go'].filter(Boolean);
let ok = false;
for (const go of candidatos) {
	if (spawnSync(go, ['run', './cmd/gendocs'], { cwd: repo, stdio: 'inherit' }).status === 0) { ok = true; break; }
}
if (!ok) {
	console.error('No se pudo ejecutar cmd/gendocs con ninguna instalación de Go.');
	process.exit(1);
}
copyFileSync(`${repo}/webpage/src/data/biblioteca.json`, 'src/data/biblioteca.json');
