/**
 * Optimized Preloader - Fast Load Version
 */

// Execute immediately to start preloading as early as possible
(function() {
    // Preload critical resources immediately
    const criticalResources = [
        { type: 'image', href: '/images/logo.png' },
        { type: 'style', href: '/css/style.css' }
    ];
    
    criticalResources.forEach(resource => {
        if (resource.type === 'image') {
            const img = new Image();
            img.src = resource.href;
        } else if (resource.type === 'style') {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource.href;
            link.onload = function() { this.rel = 'stylesheet'; };
            document.head.appendChild(link);
        }
    });
    
    // Variables for tracking progress
    let progressValue = 0;
    let loadingComplete = false;
    
    // Speed up loading for cached pages
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        progressValue = 80; // Start at higher value if page is already loaded
    }
    
    // Wait for DOM before doing element-specific operations
    document.addEventListener('DOMContentLoaded', function() {
        const progressBar = document.querySelector('.progress-bar');
        const loadingTextPercentage = document.querySelector('.loading-text-percentage');
        const loadingStatus = document.querySelector('.loading-status');
        const preloader = document.querySelector('.preloader');
        
        if (!preloader) return;
        
        // Faster loading messages
        const messages = [
            "Preparing site...", 
            "Setting up...", 
            "Almost ready..."
        ];
        
        // Fast animation frame for progress updates
        function updateProgress() {
            // Increment faster
            progressValue += (100 - progressValue) * 0.08;
            
            if (progressValue > 99.5) {
                progressValue = 100;
                loadingComplete = true;
            }
            
            // Update UI
            if (progressBar) progressBar.style.width = `${Math.floor(progressValue)}%`;
            if (loadingTextPercentage) loadingTextPercentage.textContent = `${Math.floor(progressValue)}%`;
            
            // Update loading message
            if (loadingStatus) {
                const messageIndex = Math.min(Math.floor(progressValue / 40), messages.length - 1);
                loadingStatus.textContent = messages[messageIndex];
            }
            
            // Continue animation or complete
            if (loadingComplete) {
                completeLoading();
            } else {
                requestAnimationFrame(updateProgress);
            }
        }
        
        // Faster loading completion
        function completeLoading() {
            // Shorter fade-out transition
            preloader.style.transition = 'opacity 0.3s ease-out, visibility 0.3s ease-out';
            preloader.classList.add('fade-out');
            
            // Enable page interaction sooner
            document.body.style.overflow = '';
            
            // Remove preloader sooner
            setTimeout(() => {
                preloader.style.display = 'none';
                if (typeof reveal === 'function') {
                    reveal();
                }
            }, 300);
        }
        
        // Start progress animation
        requestAnimationFrame(updateProgress);
        
        // Load actual page content eagerly
        window.addEventListener('load', function() {
            // Force faster completion on page load
            progressValue = Math.max(progressValue, 90);
            
            // Ensure preloader eventually completes
            setTimeout(() => {
                loadingComplete = true;
            }, 1000);
        });
        
        // Failsafe to ensure preloader completes
        setTimeout(() => {
            loadingComplete = true;
        }, 2500);
    });
    
    // Add low-priority prefetching for secondary resources
    function prefetchSecondaryResources() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                const secondaryResources = [
                    '/images/expertteam.jpg',
                    '/images/moderndesign.jpg',
                    '/images/safetyfirst.jpg'
                ];
                
                secondaryResources.forEach(url => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = url;
                    document.head.appendChild(link);
                });
            });
        }
    }
    
    // Execute prefetch during idle time
    if (document.readyState !== 'loading') {
        prefetchSecondaryResources();
    } else {
        document.addEventListener('DOMContentLoaded', prefetchSecondaryResources);
    }
})();
