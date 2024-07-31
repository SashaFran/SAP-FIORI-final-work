sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("DemoDemo.controller.View1", {
        onInit: function() {
            var oModel = new JSONModel({
                formData: {
                    NombrePais: "",
                    PartidoGanados: "",
                    PartidoEmpatados: "",
                    PartidoPerdidos: ""
                },
                data: []
            });
            this.getView().setModel(oModel);
        },

        onAddData: function() {
            var oModel = this.getView().getModel();
            var oData = oModel.getProperty("/formData");

            // Validaciones
            var ganados = parseInt(oData.PartidoGanados);
            var empatados = parseInt(oData.PartidoEmpatados);
            var perdidos = parseInt(oData.PartidoPerdidos);
            var total = ganados + empatados + perdidos;

            if (ganados < 0 || ganados > 3 || empatados < 0 || empatados > 3 || perdidos < 0 || perdidos > 3) {
                MessageToast.show("Cada valor de partido debe ser entre 0 y 3.");
                return;
            }

            if (total > 3) {
                MessageToast.show("La suma total de partidos no debe ser mayor a 3.");
                return;
            }

            // Añadir los datos al modelo
            var aData = oModel.getProperty("/data");
            aData.push({ 
                NombrePais: oData.NombrePais,
                PartidoGanados: oData.PartidoGanados,
                PartidoEmpatados: oData.PartidoEmpatados,
                PartidoPerdidos: oData.PartidoPerdidos
            });
            oModel.setProperty("/data", aData);
            oModel.setProperty("/formData", { NombrePais: "", PartidoGanados: "", PartidoEmpatados: "", PartidoPerdidos: "" });
        },

        onDeleteData: function(oEvent) {
            var oModel = this.getView().getModel();
            var oItem = oEvent.getSource().getBindingContext().getObject();
            var aData = oModel.getProperty("/data");

            var aNewData = aData.filter(function(data) {
                return data.NombrePais !== oItem.NombrePais;
            });

            oModel.setProperty("/data", aNewData);
        },

        onshowData: function() {
            var oModel = this.getView().getModel();
            var aData = oModel.getProperty("/data");

            var oVizFrame = this.getView().byId("idVizFrame");

            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: 'País',
                    value: "{NombrePais}"
                }],
                measures: [{
                    name: 'Ganados',
                    value: '{PartidoGanados}'
                }, {
                    name: 'Empatados',
                    value: '{PartidoEmpatados}'
                }, {
                    name: 'Perdidos',
                    value: '{PartidoPerdidos}'
                }],
                data: {
                    path: "/data"
                }
            });

            oVizFrame.setDataset(oDataset);
            oVizFrame.setModel(oModel);

   oVizFrame.setVizProperties({
        title: {
            text: "Estadísticas"
        },
        categoryAxis: {
            title: {
                text: "País",
                fontWeight: "lighter" 
            }
        },
        valueAxis: {
            title: {
                text: "Ganados & Empatados & Perdidos",
                fontWeight: "lighter" 
            }
        },
        plotArea: {
            dataLabel: {
                visible: true
            }
        }
    });
        oVizFrame.attachRenderComplete(function() {
        var svg = oVizFrame.getDomRef().querySelector('svg');
        if (svg) {
            // Aplica la clase a los títulos del eje
            svg.querySelectorAll('.v-axis .v-title').forEach(function(el) {
                el.classList.add('customAxisTitle');
            });
        }
    });
        }
    });
});
