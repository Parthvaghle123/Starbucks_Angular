import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  formData = {
    email: "",
    phone: "",
    countryCode: "+91",
    address: "",
    paymentMethod: "Cash On Delivery",
    cardNumber: "",
    expiry: "",
    cvv: "",
  };

  loading: boolean = false;
  errorMsg: string = "";

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Fetch user profile immediately on component load
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    // Ensure we're making the request
    const request = this.apiService.get<any>('api/order/profile');
    
    request.subscribe({
      next: (res) => {
        // Fill email and phone immediately
        this.formData.email = res.email || "";
        this.formData.phone = res.phone || "";
        // Force change detection to update the view
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Silently handle error - don't show error message
        console.error("Error fetching profile", err);
        this.cdr.detectChanges();
      }
    });
  }

  onCardNumberInput(event: any) {
    let val = event.target.value.replace(/\D/g, "");
    val = val.slice(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
    this.formData.cardNumber = val;
  }

  onExpiryInput(event: any) {
    let val = event.target.value.replace(/[^0-9/]/g, "").slice(0, 5);
    if (val.length === 2 && !val.includes("/")) {
      val = val + "/";
    }
    this.formData.expiry = val;
  }

  onCvvInput(event: any) {
    const onlyNums = event.target.value.replace(/\D/g, "").slice(0, 4);
    this.formData.cvv = onlyNums;
  }

  luhnCheck(numStr: string): boolean {
    let sum = 0;
    let shouldDouble = false;
    for (let i = numStr.length - 1; i >= 0; i--) {
      let digit = parseInt(numStr.charAt(i), 10);
      if (shouldDouble) {
        digit = digit * 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  placeOrder() {
    // Validate all required fields first
    if (!this.formData.email || !this.formData.email.trim()) {
      this.errorMsg = "Please fill in all details and confirm your order.";
      this.loading = false;
      return;
    }

    if (!this.formData.phone || !this.formData.phone.trim()) {
      this.errorMsg = "Please fill in all details and confirm your order.";
      this.loading = false;
      return;
    }

    if (!this.formData.address || !this.formData.address.trim()) {
      this.errorMsg = "Please fill in all details and confirm your order.";
      this.loading = false;
      return;
    }

    if (!this.formData.paymentMethod) {
      this.errorMsg = "Please fill in all details and confirm your order.";
      this.loading = false;
      return;
    }

    const rawCardNumber = this.formData.cardNumber.replace(/\s/g, "");

    // Validate card details if Online Payment is selected
    if (this.formData.paymentMethod === "Online Payment") {
      if (!rawCardNumber || !this.formData.expiry || !this.formData.cvv) {
        this.errorMsg = "Please fill in all details and confirm your order.";
        this.loading = false;
        return;
      }
      if (rawCardNumber.length < 13 || rawCardNumber.length > 19) {
        alert(" Invalid card number — it should be between 13 and 19 digits.");
        return;
      }

      if (!/^\d+$/.test(rawCardNumber)) {
        alert(" Card number must contain only digits.");
        return;
      }

      if (!this.luhnCheck(rawCardNumber)) {
        alert("Invalid card number. Please enter a valid card.");
        return;
      }

      if (!/^\d{2}\/\d{2}$/.test(this.formData.expiry)) {
        alert(" Expiry must be in MM/YY format.");
        return;
      }

      const [mm, yy] = this.formData.expiry.split("/");
      const month = parseInt(mm, 10);
      const year = parseInt("20" + yy, 10);

      if (month < 1 || month > 12) {
        alert("Invalid month.");
        return;
      }

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      if (year < currentYear) {
        alert("Card has expired.");
        return;
      }
      if (year === currentYear && month < currentMonth) {
        alert("Expiry month cannot be in the past.");
        return;
      }

      if (this.formData.cvv.length < 3) {
        alert("CVV must be at least 3 digits.");
        return;
      }
    }

    // Clear any previous error messages
    this.errorMsg = "";
    
    // Only proceed if all validations pass
    this.loading = true;

    const payload = {
      ...this.formData,
      cardNumber: rawCardNumber,
    };

    this.apiService.post("api/order/order", payload).subscribe({
      next: () => {
        // Order placed successfully - navigate to success page
        this.router.navigate(["/order-success"]);
      },
      error: (err) => {
        console.error("Order failed", err);
        this.errorMsg = "❌ Order failed. Please try again.";
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
