// Test which promise is hanging
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Set up environment
process.env.NODE_ENV = 'development';

// Import the functions
const { getFreigegebeneSlots, getAlleBuchungen } = await import(path.join(__dirname, 'src/lib/slots-store.ts'));
const { getBuchungsformularTexte, getKurskategorien } = await import(path.join(__dirname, 'src/lib/einstellungen-store.ts'));

console.log('Testing data fetching functions...\n');

try {
  console.log('Testing getFreigegebeneSlots()...');
  const slots = await Promise.race([
    getFreigegebeneSlots(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000))
  ]);
  console.log(`✓ getFreigegebeneSlots: ${slots.length} slots`);
} catch (e) {
  console.log(`✗ getFreigegebeneSlots: ${e.message}`);
}

try {
  console.log('\nTesting getAlleBuchungen()...');
  const buchungen = await Promise.race([
    getAlleBuchungen(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000))
  ]);
  console.log(`✓ getAlleBuchungen: ${buchungen.length} bookings`);
} catch (e) {
  console.log(`✗ getAlleBuchungen: ${e.message}`);
}

try {
  console.log('\nTesting getBuchungsformularTexte()...');
  const texte = await Promise.race([
    getBuchungsformularTexte(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000))
  ]);
  console.log(`✓ getBuchungsformularTexte: OK`);
} catch (e) {
  console.log(`✗ getBuchungsformularTexte: ${e.message}`);
}

try {
  console.log('\nTesting getKurskategorien()...');
  const kategorien = await Promise.race([
    getKurskategorien(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000))
  ]);
  console.log(`✓ getKurskategorien: ${kategorien.length} categories`);
} catch (e) {
  console.log(`✗ getKurskategorien: ${e.message}`);
}

console.log('\nDone!');
