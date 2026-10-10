// Model
const LoginModel = {
    state: {
        isPasswordVisible: false,
        isAuthenticating: false,
        authSuccess: false
    },
    
    togglePasswordVisibility: function() {
        this.state.isPasswordVisible = !this.state.isPasswordVisible;
        return this.state.isPasswordVisible;
    },
    
    authenticate: function(callback) {
        this.state.isAuthenticating = true;
        
        // Simulate network request
        setTimeout(() => {
            this.state.isAuthenticating = false;
            this.state.authSuccess = true;
            callback('success');
            
            // Reset after some time
            setTimeout(() => {
                this.state.authSuccess = false;
                callback('reset');
            }, 2500);
        }, 1500);
    }
};

// View
const LoginView = {
    init: function() {
        this.$passwordInput = $('#passwordInput');
        this.$toggleIcon = $('.toggle-password i');
        
        // Find whichever form is present
        this.$authForm = $('#loginForm').length ? $('#loginForm') : 
                         ($('#signupForm').length ? $('#signupForm') : $('#forgotPasswordForm'));
        this.$btn = this.$authForm.find('button[type="submit"]');
        this.$btnText = this.$btn.find('.btn-text');
        this.$spinner = this.$btn.find('.spinner-border');
    },
    
    renderPasswordVisibility: function(isVisible) {
        if (isVisible) {
            this.$passwordInput.attr('type', 'text');
            this.$toggleIcon.removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
        } else {
            this.$passwordInput.attr('type', 'password');
            this.$toggleIcon.removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
        }
    },
    
    renderAuthenticating: function() {
        this.$btn.prop('disabled', true);
        this.$btnText.text('Processing...');
        this.$spinner.removeClass('d-none');
    },
    
    renderSuccess: function() {
        this.$spinner.addClass('d-none');
        this.$btnText.html('<i class="bi bi-check-circle-fill me-2"></i>Success!');
        this.$btn.addClass('btn-success-animated');
        
        // Redirect to dashboard after a short delay if it's login or signup
        if ($('#loginForm').length || $('#signupForm').length) {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    },
    
    renderReset: function() {
        let defaultText = 'Sign In';
        if ($('#signupForm').length) defaultText = 'Sign Up';
        else if ($('#forgotPasswordForm').length) defaultText = 'Send Reset Link';
        
        this.$btn.prop('disabled', false);
        this.$btnText.text(defaultText);
        this.$btn.removeClass('btn-success-animated');
        this.$authForm[0].reset();
    }
};

// Controller
const LoginController = {
    init: function() {
        LoginView.init();
        this.bindEvents();
    },
    
    bindEvents: function() {
        // Toggle password visibility
        $('.toggle-password').click(() => {
            const isVisible = LoginModel.togglePasswordVisibility();
            LoginView.renderPasswordVisibility(isVisible);
        });

        // Form submission interaction
        LoginView.$authForm.submit((e) => {
            e.preventDefault();
            
            LoginView.renderAuthenticating();
            
            LoginModel.authenticate((status) => {
                if (status === 'success') {
                    LoginView.renderSuccess();
                } else if (status === 'reset') {
                    LoginView.renderReset();
                    
                    // Also reset the password visibility state
                    LoginModel.state.isPasswordVisible = false;
                    LoginView.renderPasswordVisibility(false);
                }
            });
        });
    }
};

// Initialize Application
$(document).ready(function() {
    LoginController.init();
});
