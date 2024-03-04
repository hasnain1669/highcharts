const { ComponentRegistry, Component } = Dashboards;

class YouTubeComponent extends Component {
    constructor(cell, options) {
        super(cell, options);
        this.type = 'YouTube';
        this.youTubeElement = document.createElement('iframe');
        return this;
    }

    resize(width, height) {
        super.resize(width, height);
    }

    async load() {
        super.load();

        this.youTubeElement.setAttribute(
            'src',
            'https://www.youtube.com/embed/' + this.options.videoId
        );
        this.youTubeElement.setAttribute('title', 'YouTube video player');
        this.youTubeElement.setAttribute('frameborder', '0');
        this.youTubeElement.allowfullscreen = true;
        this.contentElement.appendChild(this.youTubeElement);
        this.parentElement.appendChild(this.element);

        return this;
    }

    getOptionsOnDrop(sidebar) {
        super.getOptionsOnDrop.call(this, sidebar);
        return {
            renderTo: '',
            type: 'YouTube',
            videoId: '115hdz9NsrY'
        };
    }
}

ComponentRegistry.registerComponent('YouTube', YouTubeComponent);

Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        },
        toolbars: {
            sidebar: {
                components: ['YouTube', 'HTML', 'Highcharts']
            }
        }
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'chart'
                }, {
                    id: 'yt-highsoft'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'chart',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3]
            }]
        }
    }, {
        renderTo: 'yt-highsoft',
        type: 'YouTube',
        videoId: '115hdz9NsrY'
    }]
});
