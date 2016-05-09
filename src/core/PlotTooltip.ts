/// <reference path="../interfaces/Tooltip.ts"/>

module semio.shape {
    import Tooltip = semio.interfaces.Tooltip;
    
    export class PlotTooltip implements Tooltip {   
        constructor(private containerId: string) { } 
    }
}