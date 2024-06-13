
window.addEventListener('load', function() {
    const params = new URLSearchParams(window.location.search);
    const graphType = params.get('graphType');
    const layouts = params.get('layouts').split(',');

    document.getElementById('graph-type-value').innerText = graphType;

    const layoutContainer = document.getElementById('layout-options');
    layouts.forEach(layout => {
        const button = document.createElement('button');
        button.innerText = layout + " Layout";
        button.addEventListener('click', function() {
            if (layout === 'Rheingold Tilford') { 
                window.location.href = 'Rheingold.html';
            } else if (layout === 'Grid') {
                window.location.href = 'gridLayoutPage.html';
            } else if (layout === 'Chord') {
                window.location.href = 'Chord.html';
            } else if (layout=== 'Icicle'){
                window.location.href ='Icicle.html';
            }else if (layout=== 'Sugiyama'){
                window.location.href ='Sugiyama.html';
            }else if (layout=== 'Radial Sugiyama'){
                window.location.href ='Radial_Sug.html';
            }
          
        });
        layoutContainer.appendChild(button);
    });
});
