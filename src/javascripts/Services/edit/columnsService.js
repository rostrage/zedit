ngapp.service('columnsService', function(columnsFactory) {
    let service = this,
        nativeColumns = columnsFactory.columns,
        exportKeys = ['label', 'width', 'getDataCode', 'enabled'];

    // private functions
    let buildColumn = {
        custom: function(column) {
            let customColumn = Object.defaults({ custom: true }, column);
            service.buildDataFunction(customColumn);
            return customColumn;
        },
        native: function(column) {
            let nativeColumn = nativeColumns.findByKey('label', column.label);
            return Object.assign({}, column, nativeColumn);
        }
    };

    let buildColumns = function(columns) {
        return columns.map(column => {
            let columnType = column.getDataCode ? 'custom' : 'native';
            return buildColumn[columnType](column);
        });
    };

    let getColumnsPath = function(viewName) {
        return fh.userDir.path('columns', `${viewName}.json`);
    };

    let loadColumns = function(viewName) {
        let columnsPath = getColumnsPath(viewName),
            columns = fh.loadJsonFile(columnsPath) || columnsFactory[viewName];
        service[`${viewName}Columns`] = buildColumns(columns);
    };

    // public functions
    this.buildDataFunction = function(column) {
        try {
            column.getData = new Function('node', 'xelib', column.getDataCode);
        } catch(e) {
            console.log(`Exception building data function for column: ${column.label}:`);
            console.log(e);
            column.getData = () => {};
        }
    };

    this.getColumns = function(viewName) {
        let columnsKey = `${viewName}Columns`;
        if (!service[columnsKey]) loadColumns(viewName);
        return service[columnsKey];
    };

    this.saveColumns = function(viewName) {
        let data = service[`${viewName}Columns`].map(column => {
            return Object.copyProperties(column, exportKeys);
        });
        fh.saveJsonFile(getColumnsPath(viewName), data);
    };
});
