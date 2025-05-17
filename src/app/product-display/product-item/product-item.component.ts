import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonButton } from "@ionic/angular/standalone";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}
interface Posts {
  id: number;
  name: string;
  description: string;
  title: string
}
@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  standalone:true,
imports: [CommonModule, IonicModule], 
})
export class ProductItemComponent implements OnInit {
  //@Input() and @Output() are fundamental mechanisms in Angular for enabling communication between parent and child components:

// 1. @Input(): Parent to Child Communication (Data Down)

// Purpose: The @Input() decorator allows a child component to receive data from its parent component. It marks a property in the child component as a target for data binding from the parent's template.

// How it Works:

// Declare in Child: In the child component's class, you decorate a property with @Input().
// Bind in Parent's Template: In the parent component's template, when using the child component's selector, you use property binding ([childPropertyName]="parentPropertyValue") to pass data to the child's @Input() property.
// Access in Child: The child component can then access the received data through the decorated property within its class and template.
// Analogy: Think of it like plugging a cable (the property binding) from the parent (the source of data) into a port (the @Input() property) on the child (the receiver of data).

// 2. @Output(): Child to Parent Communication (Events Up)

// Purpose: The @Output() decorator allows a child component to emit custom events that the parent component can listen to and respond to.

// How it Works:

// Declare in Child: In the child component's class, you decorate an EventEmitter property with @Output(). EventEmitter is a class from @angular/core specifically designed for emitting custom events.
// Emit Event in Child: When the child component wants to send data or signal an event to the parent, it calls the emit() method on the EventEmitter. You can optionally pass data as an argument to emit().
// Listen in Parent's Template: In the parent component's template, when using the child component's selector, you use event binding ((childOutputPropertyName)="parentMethod($event)") to listen for the event emitted by the child. The $event object will contain any data passed by the child's emit() call.
// Handle in Parent: The parentMethod() in the parent component's class will be executed when the event is emitted, and it can access the data passed from the child through the $event parameter.
// Analogy: Think of it like the child having a button (the action that triggers the event). When the button is pressed, the child sends a signal (the emit()) along a channel (the @Output() property) to the parent, who has an antenna (the event binding) tuned to listen for that specific signal. The signal can also carry a message (the data passed with emit()).

// How @Input() and @Output() Communicate with Each Other (Indirectly)

// It's crucial to understand that @Input() and @Output() don't directly communicate with each other within the child component. They serve as separate pathways for data flow:

// Parent sends data to Child via @Input().
// Child performs some action or has some data change.
// Child notifies Parent about this action or data change by emitting an event via @Output().
// Parent receives the event and the associated data (if any).
// Based on the received information, the Parent might update its own data.
// If the Parent's data changes and needs to be reflected in the Child, the Parent will then pass the updated data down to the Child via @Input() again.


//short notes
// @Input() (Parent to Child):

// Purpose: Receives data from the parent component.
// Mechanism: Decorate a child component property with @Input().
// Binding: Parent uses [childProperty]="parentData" in its template.
// Flow: Data flows down from parent to child.
// @Output() (Child to Parent):

// Purpose: Emits custom events to the parent component.
// Mechanism: Decorate an EventEmitter property in the child with @Output().
// Emitting: Child uses this.outputEventEmitter.emit(data) to send data up.
// Listening: Parent uses (childOutput)="parentMethod($event)" in its template to handle the event and data.
// Flow: Events flow up from child to parent.



  @Input() product!: Product;
  @Input() isSelected: boolean = false;
  @Output() addToCart: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() selectProduct: EventEmitter<Product> = new EventEmitter<Product>();

  //   @Input() posts!: Posts;
  // @Input() isPostSelected: boolean = false;
  // @Output() addPostToCart: EventEmitter<Posts> = new EventEmitter<Posts>();
  // @Output() selectPostProduct: EventEmitter<Posts> = new EventEmitter<Posts>();
  constructor() { }

  ngOnInit() { }
  addToCartClicked(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
  onSelect() {
    this.selectProduct.emit(this.product);
  }

  // addToPostCartClicked(event: Event) {
  //   event.stopPropagation();
  //   this.addPostToCart.emit(this.posts);
  // }
  // onPostSelect() {
  //   this.selectPostProduct.emit(this.posts);
  // }

}
