import type DataJSON from '../Data/DataJSON';

import Layout from './Layout/Layout.js';
import Bindings from './Actions/Bindings.js';

import U from '../Core/Utilities.js';
import H from '../Core/Globals.js';

const {
    doc
} = H;

const {
    merge,
    error,
    isString,
    objectEach
} = U;

class Dashboard {
    /* *
    *
    *  Static Properties
    *
    * */

    protected static readonly defaultOptions: Dashboard.Options = {
        gui: {
            enabled: true,
            layoutOptions: {
                rowClassName: void 0,
                columnClassName: void 0
            },
            layouts: []
        },
        componentOptions: {
            isResizable: true
        },
        components: []
    };

    public static fromJSON(json: Dashboard.ClassJSON): Dashboard {
        const options = json.options,
            dashboard = new Dashboard(
                options.containerId,
                {
                    layoutsJSON: options.layouts,
                    componentOptions: options.componentOptions
                }
            );

        return dashboard;
    }

    /* *
    *
    *  Constructors
    *
    * */
    public constructor(
        renderTo: (string|globalThis.HTMLElement),
        options: Dashboard.Options
    ) {
        this.options = merge(Dashboard.defaultOptions, options);
        this.layouts = [];
        this.guiEnabled = (this.options.gui || {}).enabled;
        this.mountedComponents = [];

        this.initContainer(renderTo);

        // Init layouts from options.
        if (options.gui && this.options.gui) {
            this.setLayouts(this.options.gui);
        }

        // Init layouts from JSON.
        if (options.layoutsJSON && !this.layouts.length) {
            this.setLayoutsFromJSON(options.layoutsJSON);
        }

        // Init components from options.
        if (options.components) {
            this.setComponents(options.components);
        }
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: Dashboard.Options;
    public layouts: Array<Layout>;
    public mountedComponents: Array<Bindings.MountedComponentsOptions>;
    public container: globalThis.HTMLElement = void 0 as any;
    public guiEnabled: (boolean|undefined);
    /* *
     *
     *  Functions
     *
     * */

    /**
     * initContainer
     *
     * @param {string|Highcharts.HTMLDOMElement} [renderTo]
     * The DOM element to render to, or its id.
     *
     */
    public initContainer(
        renderTo: (string|globalThis.HTMLElement)
    ): void {
        const dashboard = this;

        if (isString(renderTo)) {
            dashboard.container = renderTo =
                doc.getElementById(renderTo as any) as any;
        }

        // Display an error if the renderTo is wrong
        if (!renderTo) {
            error(13, true);
        }
    }

    public setLayouts(guiOptions: Dashboard.GUIOptions): void {
        const dashboard = this,
            layoutsOptions = guiOptions.layouts;

        for (let i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            dashboard.layouts.push(
                new Layout(
                    dashboard,
                    merge({}, guiOptions.layoutOptions, layoutsOptions[i])
                )
            );
        }
    }

    public setLayoutsFromJSON(json: Array<Layout.ClassJSON>): void {
        const dashboard = this;

        for (let i = 0, iEnd = json.length; i < iEnd; ++i) {
            dashboard.layouts.push(
                Layout.fromJSON(json[i], dashboard)
            );
        }
    }

    public setComponents(
        components: Array<Bindings.ComponentOptions>
    ): void {
        const dashboard = this;

        let component,
            column;

        for (let i = 0, iEnd = components.length; i < iEnd; ++i) {
            component = Bindings.addComponent(components[i]);
            column = Bindings.getColumn(components[i].column);

            if (column && component) {
                column.mountedComponent = component; // @ToDo column.addComponent() perhaps? - checks if column is free

                dashboard.mountedComponents.push({
                    options: components[i],
                    component: component,
                    column: column
                });
            } else {
                // Error
            }
        }
    }

    /**
     * Destroy the element and its layouts.
     */
    public destroy(): undefined {
        const dashboard = this;

        // Destroy layouts.
        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            dashboard.layouts[i].destroy();
        }

        // @ToDo Destroy bindings.

        // Delete all properties.
        objectEach(dashboard, function (val: unknown, key: string): void {
            delete (dashboard as Record<string, any>)[key];
        });

        return;
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Dashboard.ClassJSON}
     * Class JSON of this Dashboard instance.
     */
    public toJSON(): Dashboard.ClassJSON {
        const dashboard = this,
            layouts = [];

        // Get layouts JSON.
        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            layouts.push(dashboard.layouts[i].toJSON());
        }

        return {
            $class: 'Dashboard',
            options: {
                containerId: dashboard.container.id,
                guiEnabled: dashboard.guiEnabled,
                layouts: layouts,
                componentOptions: dashboard.options.componentOptions
            }
        };
    }

    /**
     * Export layouts from the local storage
     */
    public exportLocal(): void {
        const layouts = this.layouts;

        for (let i = 0, iEnd = layouts.length; i < iEnd; ++i) {
            layouts[i].exportLayout();
        }
    }

    /**
     * Import layouts from the local storage
     */
    public importLocal(): void {
        const layouts = this.layouts;

        for (let i = 0, iEnd = layouts.length; i < iEnd; ++i) {
            layouts[i].importLayout();
        }
    }
}

namespace Dashboard {
    export interface Options {
        gui?: GUIOptions;
        components?: Array<Bindings.ComponentOptions>;
        componentOptions?: Partial<Bindings.ComponentOptions>;
        layoutsJSON?: Array<Layout.ClassJSON>;
    }

    export interface GUIOptions {
        enabled: boolean;
        layoutOptions: Partial<Layout.Options>;
        layouts: Array<Layout.Options>;
    }

    export interface ClassJSON extends DataJSON.ClassJSON {
        options: DashboardJSONOptions;
    }

    export interface DashboardJSONOptions extends DataJSON.JSONObject {
        containerId: string;
        layouts: Array<Layout.ClassJSON>;
        guiEnabled?: boolean;
        componentOptions?: Partial<Bindings.ComponentOptions>;
    }
}

export default Dashboard;
