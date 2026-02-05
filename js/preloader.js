(function() {
    // Skip redundant preload of style.css - it's already in <head>
    const logoImg = new Image();
    logoImg.src = '/images/logo.png';
    
    let progressValue = 0;
    let loadingComplete = false;
    
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        progressValue = 80; 
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        const progressBar = document.querySelector('.progress-bar');
        const loadingTextPercentage = document.querySelector('.loading-text-percentage');
        const loadingStatus = document.querySelector('.loading-status');
        const preloader = document.querySelector('.preloader');
        
        if (!preloader) return;
        
        const messages = [
            "Preparing site...", 
            "Setting up...", 
            "Almost ready..."
        ];
        
        function updateProgress() {
            progressValue += (100 - progressValue) * 0.08;
            
            if (progressValue > 99.5) {
                progressValue = 100;
                loadingComplete = true;
            }
            
            const floored = Math.floor(progressValue);
            if (progressBar) progressBar.style.width = floored + '%';
            if (loadingTextPercentage) loadingTextPercentage.textContent = floored + '%';
            
            if (loadingStatus) {
                const messageIndex = Math.min(Math.floor(progressValue / 40), messages.length - 1);
                loadingStatus.textContent = messages[messageIndex];
            }
            
            if (loadingComplete) {
                completeLoading();
            } else {
                requestAnimationFrame(updateProgress);
            }
        }
        
        function completeLoading() {
            preloader.classList.add('fade-out');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                preloader.style.display = 'none';
                preloader.remove(); // Remove from DOM entirely
                if (typeof reveal === 'function') {
                    reveal();
                }
            }, 300);
        }
        
        requestAnimationFrame(updateProgress);
        
        window.addEventListener('load', function() {
            progressValue = Math.max(progressValue, 90);
            
            setTimeout(() => {
                loadingComplete = true;
            }, 800);
        });
        
        // Failsafe: ensure preloader always clears
        setTimeout(() => {
            loadingComplete = true;
        }, 2500);
    });
    
    // Prefetch secondary resources during idle time
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
    
    if (document.readyState !== 'loading') {
        prefetchSecondaryResources();
    } else {
        document.addEventListener('DOMContentLoaded', prefetchSecondaryResources);
    }
})();
