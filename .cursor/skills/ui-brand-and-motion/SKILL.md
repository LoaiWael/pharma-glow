---
name: ui-brand-and-motion-styling
description: Enforces the mandatory usage of brand design tokens defined in index.css for all UI updates and the motion package for all UI animations.
---

# UI Brand Styling & Motion Animation Rules

This skill enforces strict UI styling and animation standards for both **Antigravity** and **Cursor** when working on the codebase.

---

## 1. Mandatory Brand Colors Usage

All UI updates, components, and layout styling **must strictly use the project's brand color tokens** declared in `src/index.css`. 

### Brand Palette Reference (`src/index.css`):
- **Primary Color**: `#fce6e9` (`var(--color-primary)` / CSS variables `--primary-*` shade palette: `50` to `950`, Tailwind classes: `bg-primary`, `text-primary`, `bg-primary-500`, `border-primary-400`, etc.)
- **Secondary Color**: `#de7a87` (`var(--color-secondary)` / CSS variables `--secondary-*` shade palette: `50` to `950`, Tailwind classes: `bg-secondary`, `text-secondary`, `bg-secondary-600`, etc.)
- **Tertiary Color**: `#5E6C84` (`var(--color-tertiary)` / CSS variables `--tertiary-*` shade palette: `50` to `950`, Tailwind classes: `bg-tertiary`, `text-tertiary`, `text-tertiary-500`, etc.)
- **Neutral / Background**: `#F4F8FE` (`var(--color-neutral)` / Tailwind classes: `bg-neutral`, `bg-background`, `text-foreground`)

### Rules for UI Updates:
1. **No Ad-hoc / Hardcoded Hex Colors**: Never use arbitrary inline styles (e.g. `style={{ color: '#123456' }}`) or arbitrary tailwind color classes (e.g. `bg-[#fce6e9]` or `text-blue-500`) unless explicitly instructed by the user.
2. **Use Tailwind Token Classes**: Use theme utility classes such as `bg-primary`, `bg-primary-500`, `text-secondary`, `text-secondary-600`, `border-tertiary-200`, `bg-neutral`, `bg-background`, `text-foreground`.
3. **Use CSS Variables when Writing CSS**: Use `var(--primary)`, `var(--secondary)`, `var(--tertiary)`, `var(--neutral)`, `var(--color-primary)`, `var(--color-secondary)` when working in `.css` or custom style modules.

---

## 2. Mandatory Animation Standard (`motion` Package)

Whenever any UI animation, transition, interactive micro-interaction, page transition, or modal entry/exit is created or updated, **you MUST use the `motion` package** (`motion/react` or `framer-motion`).

### Guidelines for Animations:
1. **Import Source**:
   ```tsx
   import { motion, AnimatePresence } from "motion/react";
   // Or import { motion, AnimatePresence } from "framer-motion";
   ```
2. **Component Usage**:
   - Replace standard HTML tags with `motion` components for animated elements (e.g., `<motion.div>`, `<motion.button>`, `<motion.section>`).
   - Use standard Framer Motion props for enter/exit and hover transitions:
     ```tsx
     <motion.div
       initial={{ opacity: 0, y: 15 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -10 }}
       transition={{ duration: 0.3, ease: "easeOut" }}
     >
       {/* Content */}
     </motion.div>
     ```
3. **Interactive Micro-animations**:
   - Apply hover and tap gesture animations using `whileHover` and `whileTap`:
     ```tsx
     <motion.button
       whileHover={{ scale: 1.02 }}
       whileTap={{ scale: 0.98 }}
       className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md"
     >
       Submit
     </motion.button>
     ```
4. **Conditional / List Animations**:
   - Wrap dynamic list items or toggled components inside `<AnimatePresence>` to manage enter/exit animations smoothly.
