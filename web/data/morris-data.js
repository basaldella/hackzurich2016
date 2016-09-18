$(function() {

    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '-5',
            iphone: 26,
            ipad: 25
        }, {
            period: '-4',
            iphone: 27,
            ipad: 22
			}, {
            period: '-3',
            iphone: 49,
            ipad: 19
        }, {
            period: '-2',
            iphone: 37,
            ipad: 37
        }, {
            period: '-1',
            iphone: 68,
            ipad: 19
        }, {
            period: 'current',
            iphone: -56,
            ipad: 42
        }, {
            period: '+1',
            iphone: 48,
            ipad: -37
        }, {
            period: '+2',
            iphone: 150,
            ipad: -59
        }, {
            period: '+3',
            iphone: 106,
            ipad: 44
        }, {
            period: '+4',
            iphone: 84,
            ipad: 57
			}],
        xkey: 'period',
		parseTime : false,
        ykeys: ['iphone', 'ipad', ],
        labels: ['John Smith', 'Anne Other'],
        pointSize: 2,
        hideHover: 'auto',
		smooth : false,
        resize: true
    });

    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "Download Sales",
            value: 12
        }, {
            label: "In-Store Sales",
            value: 30
        }, {
            label: "Mail-Order Sales",
            value: 20
        }],
        resize: true
    });

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            y: '2006',
            a: 100,
            b: 90
        }, {
            y: '2007',
            a: 75,
            b: 65
        }, {
            y: '2008',
            a: 50,
            b: 40
        }, {
            y: '2009',
            a: 75,
            b: 65
        }, {
            y: '2010',
            a: 50,
            b: 40
        }, {
            y: '2011',
            a: 75,
            b: 65
        }, {
            y: '2012',
            a: 100,
            b: 90
        }],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        hideHover: 'auto',
        resize: true
    });
    
});
