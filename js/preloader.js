(function() {
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
            
            if (progressBar) progressBar.style.width = `${Math.floor(progressValue)}%`;
            if (loadingTextPercentage) loadingTextPercentage.textContent = `${Math.floor(progressValue)}%`;
            
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
            preloader.style.transition = 'opacity 0.3s ease-out, visibility 0.3s ease-out';
            preloader.classList.add('fade-out');
            
            document.body.style.overflow = '';
            
            setTimeout(() => {
                preloader.style.display = 'none';
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
            }, 1000);
        });
        
        setTimeout(() => {
            loadingComplete = true;
        }, 2500);
    });
    
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
