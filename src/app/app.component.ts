import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <main class="container">
      <h1>{{ title }}</h1>
      <p>Welcome to {{ getAppName() }}</p>
      <div class="counter">
        <p>Count: {{ count }}</p>
        <button (click)="increment()">Increment</button>
        <button (click)="decrement()">Decrement</button>
        <button (click)="reset()">Reset</button>
      </div>
    </main>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      text-align: center;
    }
    h1 {
      color: #1976d2;
      margin-bottom: 1rem;
    }
    .counter {
      margin-top: 2rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .counter p {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    button {
      margin: 0 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      cursor: pointer;
      border: none;
      border-radius: 4px;
      background: #1976d2;
      color: white;
    }
    button:hover {
      background: #1565c0;
    }
  `]
})
export class AppComponent {
  title = 'My Angular App';
  count = 0;

  getAppName(): string {
    return this.title;
  }

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }

  reset(): void {
    this.count = 0;
  }
}

