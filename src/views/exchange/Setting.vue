<template>
 <div>
    <Card>
			<p slot="title">
        Configuración de monedas
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>actualizar
        </Button>
			</p>
      <Row class="functionWrapper" style='padding:0px 8px 8px 8px'>
        <Col span="18">
          <div class="searchWrapper" style="float:left;">
              <div class="poptip">
                  <Input placeholder="nombre de la moneda" v-model="searchSymbol" /></Input>
              </div>
              <div class="poptip">/</div>
              <div class="poptip">
                  <Input placeholder="Nombre de moneda base" v-model="searchBase" /></Input>
              </div>
              <div class="btns">
                  <Button type="info" @click="search">búsqueda</Button>
              </div>
          </div>
        </Col>
        <Col span="6">
          <div style="float: right" class="clearfix">
            <Button type="error" @click="delcoin" >eliminar par comercial</Button>
            <Button type="primary"@click="addcoin">Agregar par comercial</Button>

          </div>
        </Col>
      </Row>

      <Modal
          class="auditModel"
          v-model="fixModel"
          title="Modificar información"
          @on-ok="confirmClicked">
          <ul>
            <li><span><i>*</i> par comercial：</span>
              <p>
                <Input v-model="fixSymbol" disabled></Input>
                <span>{{ }}</span>
              </p>
            </li>

            <li><span><i>*</i> tasa de tramitación：</span>
                <p><Input v-model="fee"
                 :class="{'errorFormatBorder': feeClass}"
                  @on-change="checkFee(fee)"></Input>
                </p>
                <em v-show="feeClass">formato incorrecto</em>
            </li>

            <li><span><i>*</i> estado：</span>
              <p>
                <RadioGroup v-model="fixEnable">
                  <Radio label="1"><em>Habilitado (enumerado)</em></Radio>
                  <Radio label="2"><em>Prohibido (eliminado)</em></Radio>
                </RadioGroup>
              </p>
            </li>
            <li><span><i>*</i> pantalla frontal：</span>
              <p>
                <RadioGroup v-model="fixVisible">
                  <Radio label="1"><em>mostrar</em></Radio>
                  <Radio label="2"><em>ocultar</em></Radio>
                </RadioGroup>
              </p>
            </li>
            <li><span><i>*</i> ¿Es negociable?：</span>
              <p>
                <RadioGroup v-model="fixExchangeable">
                  <Radio label="1"><em>Sí</em></Radio>
                  <Radio label="2"><em>No</em></Radio>
                </RadioGroup>
              </p>
            </li>
            <li><span><i>*</i> comprar en el mercado：</span>
              <p>
                <RadioGroup v-model="fixEnableMarketBuy">
                  <Radio label="1"><em>Pueden</em></Radio>
                  <Radio label="0"><em>No poder</em></Radio>
                </RadioGroup>
              </p>
            </li>
            <li><span><i>*</i> precio de mercado：</span>
              <p>
                <RadioGroup v-model="fixEnableMarketSell">
                  <Radio label="1"><em>Pueden</em></Radio>
                  <Radio label="0"><em>No poder</em></Radio>
                </RadioGroup>
              </p>
            </li>

            <li><span><i>*</i> disponible para compra：</span>
              <p>
                <RadioGroup v-model="fixEnableBuy">
                  <Radio label="1"><em>Pueden</em></Radio>
                  <Radio label="0"><em>No poder</em></Radio>
                </RadioGroup>
              </p>
            </li>

            <li><span><i>*</i> disponible para venta：</span>
              <p>
                <RadioGroup v-model="fixEnableSell">
                  <Radio label="1"><em>Pueden</em></Radio>
                  <Radio label="0"><em>No poder</em></Radio>
                </RadioGroup>
              </p>
            </li>
            <li><span><i>*</i> clasificar：</span>
              <p><Input v-model="fixSort"
                        :class="{'errorFormatBorder': sortClass}"
                        @on-change="checksort(fixSort)" placeholder="Ejemplo: 5, debe ser mayor que 4 (obligatorio)"></Input>
              </p>
              <em v-show="sortClass">formato incorrecto</em>
            </li>

            <li><span><i>*</i> Precio máximo de compra：</span>
                <p><Input v-model="fixMaxBuyPrice"></Input>
                </p>
            </li>
            <li><span><i>*</i> Cantidad mínima de pedido：</span>
                <p><Input v-model="fixMinTurnover"></Input>
                </p>
            </li>
          </ul>

      </Modal>
      <Modal
          class="auditModel"
          v-model="auditModal"
          title="Agregar moneda"
          width="850"
          @on-ok="confirmAudit">
          <Row :gutter="30">
            <Col span="10">
              <p class="setting-title">Configuración de información básica</p>
              <ul>
                <li><span><i>*</i> par comercial：</span>
                  <p>
                    <Input v-model="symbol"
                           :class="{'errorFormatBorder': checkSymbolClass}"
                           @on-change="checkPair(symbol)" placeholder="ejemplo: SHIB/USDT(deber)"></Input>
                  </p>
                  <em v-show="checkSymbolClass">formato incorrecto</em>
                </li>
                <li><span><i>*</i> Moneda de transacción：</span>
                  <p><Input v-model="coinSymbol"
                            :class="{'errorFormatBorder': coinSymbolClass}"
                            @on-change="checkCoinSymbol(coinSymbol)"  placeholder="ejemplo: SHIB(deber)"></Input>
                  </p>
                  <em v-show="coinSymbolClass">formato incorrecto</em>
                </li>

                <li><span><i>*</i> Moneda de liquidación：</span>
                  <p><Input v-model="baseSymbol"
                            :class="{'errorFormatBorder': baseSymbolClass}"
                            @on-change="checkbaseSymbol(baseSymbol)" placeholder="ejemplo: USDT(deber)"></Input>
                  </p>
                   <em v-show="baseSymbolClass">formato incorrecto</em>
                </li>

                <li><span><i>*</i> tasa de tramitación：</span>
                  <p><Input v-model="fee"
                   :class="{'errorFormatBorder': feeClass}"
                    @on-change="checkFee(fee)" placeholder="Ejemplo: 0.001 (obligatorio)"></Input>
                  </p>
                  <em v-show="feeClass">formato incorrecto</em>
                </li>

                <li><span><i>*</i> Precisión de moneda：</span>
                  <p><Input v-model="coinScale"
                            :class="{'errorFormatBorder': coinScaleClass}"
                            @on-change="checkCoinScale(coinScale)" placeholder="Ejemplo: 4 (obligatorio)"></Input>
                  </p>
                  <em v-show="coinScaleClass">formato incorrecto</em>

                </li>

                <li><span><i>*</i> Precisión decimal de la moneda base：</span>
                  <p><Input v-model="baseCoinScale"
                            :class="{'errorFormatBorder': baseCoinScaleClass}"
                            @on-change="checkbaseCoinScale(baseCoinScale)" placeholder="Ejemplo: 6 (obligatorio)"></Input>
                  </p>
                  <em v-show="baseCoinScaleClass">formato incorrecto</em>
                </li>
                <li><span><i>*</i> precio mínimo de venta：</span>
                  <p><Input v-model="minSellPrice"
                            :class="{'errorFormatBorder': minSellPriceClass}"
                            @on-change="checkminSellPrice(minSellPrice)" placeholder="no limitado: 0.00000000(deber)"></Input>
                  </p>
                  <em v-show="minSellPriceClass">formato incorrecto</em>
                </li>
                <li><span><i>*</i> Precio máximo de compra：</span>
                  <p><Input v-model="maxBuyPrice"
                            :class="{'errorFormatBorder': maxBuyPriceClass}"
                            @on-change="checkmaxBuyPrice(maxBuyPrice)" placeholder="no limitado: 0.00000000(deber)"></Input>
                  </p>
                  <em v-show="maxBuyPriceClass">formato incorrecto</em>
                </li>
                <li><span><i>*</i> Cantidad mínima de pedido：</span>
                  <p><Input v-model="minVolume"
                            :class="{'errorFormatBorder': minVolumeClass}"
                            @on-change="checkminVolume(minVolume)" placeholder="no limitado: 0.00000000(deber)"></Input>
                  </p>
                  <em v-show="minVolumeClass">formato incorrecto</em>
                </li>
                <li><span><i>*</i> Cantidad máxima de pedido：</span>
                  <p><Input v-model="maxVolume"
                            :class="{'errorFormatBorder': maxVolumeClass}"
                            @on-change="checkmaxVolume(maxVolume)" placeholder="no limitado: 0.00000000(deber"></Input>
                  </p>
                  <em v-show="maxVolumeClass">formato incorrecto</em>
                </li>
                <li><span><i>*</i> Área de comercio：</span>
                  <p><Input v-model="zone"
                            :class="{'errorFormatBorder': zoneClass}"
                            @on-change="checkzone(zone)" placeholder="0:Placa base, 1: Placa de innovación(deber)"></Input>
                  </p>
                  <em v-show="zoneClass">formato incorrecto</em>
                </li>
                <li><span><i>*</i>Monto mínimo de orden pendiente：</span>
                  <p><Input v-model="minTurnover"
                            :class="{'errorFormatBorder': minTurnoverClass}"
                            @on-change="checkminTurnover(minTurnover)" placeholder="no limitado: 0.00000000(deber)"></Input>
                  </p>
                  <em v-show="minTurnoverClass">formato incorrecto</em>
                </li>
                <li><span><i>*</i>clasificar：</span>
                  <p><Input v-model="sort"
                            :class="{'errorFormatBorder': sortClass}"
                            @on-change="checksort(sort)" placeholder="Ejemplo: 5, debe ser mayor que 4 (obligatorio)"></Input>
                  </p>
                  <em v-show="sortClass">formato incorrecto</em>
                </li>
              </ul>
            </Col>
            <Col span="12">
              <Row :gutter="30">
                <p class="setting-title">Configuración de actividad de moneda</p>
                <ul>
                  <li><span><i>*</i>tipo de actividad：</span>
                    <p>
                      <RadioGroup v-model="publishType">
                        <Radio label="1"><em>ninguna actividad</em></Radio>
                        <Radio label="2"><em>liberación rápida</em></Radio>
                        <Radio label="3"><em>problema de prorrateo</em></Radio>
                      </RadioGroup>
                    </p>
                  </li>
                  <li><span>Hora de inicio del evento：</span>
                    <p>
                      <DatePicker v-model="startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="yyyy-MM-dd HH:mm:ss" style="width: 200px"></DatePicker>
                    </p>
                    <em>Es necesario configurar tanto la emisión instantánea como la emisión de prorrateo.</em>
                  </li>
                  <li><span>Hora de finalización del evento：</span>
                    <p>
                      <DatePicker v-model="endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="yyyy-MM-dd HH:mm:ss" style="width: 200px"></DatePicker>
                    </p>
                    <em>Es necesario configurar tanto la emisión instantánea como la emisión de prorrateo.</em>
                  </li>
                  <li><span>hora de finalización de la liquidación：</span>
                    <p>
                      <DatePicker v-model="clearTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="yyyy-MM-dd HH:mm:ss" style="width: 200px"></DatePicker>
                    </p>
                    <em>Es necesario configurar tanto la emisión instantánea como la emisión de prorrateo.</em>
                  </li>
                  <li><span>Precio de emisión asignado：</span>
                    <p><Input v-model="publishPrice"
                               style="width: 200px"
                              :class="{'errorFormatBorder': publishPriceClass}"
                              @on-change="checkpublishPrice(publishPrice)" placeholder="no limitado: 0.00000000(deber)"></Input>
                    </p>
                    <em>Es necesario configurar tanto la emisión instantánea como la emisión de prorrateo.</em>
                  </li>
                  <li><span>Número de emisión：</span>
                    <p><Input v-model="publishAmount"
                               style="width: 200px" placeholder="不限制: 10000.00000000(deber)"></Input>
                    </p>
                    <em>Es necesario configurar tanto la emisión instantánea como la emisión de prorrateo.</em>
                  </li>
                </ul>
              </Row>
              <Row :gutter="30">
                <p class="setting-title">Configuración de estado de moneda</p>
                <ul>
                  <li><span><i>*</i> estado：</span>
                    <p>
                      <RadioGroup v-model="enable">
                        <Radio label="1"><em>habilitar</em></Radio>
                        <Radio label="2"><em>prohibir</em></Radio>
                      </RadioGroup>
                    </p>
                  </li>
                  <li><span><i>*</i> pantalla frontal：</span>
                    <p>
                      <RadioGroup v-model="visible">
                        <Radio label="1"><em>mostrar</em></Radio>
                        <Radio label="2"><em>ocultar</em></Radio>
                      </RadioGroup>
                    </p>
                  </li>
                  <li><span><i>*</i> ¿Es negociable?：</span>
                    <p>
                      <RadioGroup v-model="exchangeable">
                        <Radio label="1"><em>Sí</em></Radio>
                        <Radio label="2"><em>no</em></Radio>
                      </RadioGroup>
                    </p>
                  </li>
                  <li><span><i>*</i> comprar en el mercado：</span>
                    <p>
                      <RadioGroup v-model="enableMarketBuy">
                        <Radio label="1"><em>Pueden</em></Radio>
                        <Radio label="0"><em>No poder</em></Radio>
                      </RadioGroup>
                    </p>
                  </li>
                  <li><span><i>*</i> precio de mercado：</span>
                    <p>
                      <RadioGroup v-model="enableMarketSell">
                        <Radio label="1"><em>Pueden</em></Radio>
                        <Radio label="0"><em>No poder</em></Radio>
                      </RadioGroup>
                    </p>
                  </li>
                  <li><span><i>*</i> disponible para compra：</span>
                    <p>
                      <RadioGroup v-model="enableBuy">
                        <Radio label="1"><em>Pueden</em></Radio>
                        <Radio label="0"><em>No poder</em></Radio>
                      </RadioGroup>
                    </p>
                  </li>
                  <li><span><i>*</i> disponible para venta：</span>
                    <p>
                      <RadioGroup v-model="enableSell">
                        <Radio label="1"><em>Pueden</em></Radio>
                        <Radio label="0"><em>No poder</em></Radio>
                      </RadioGroup>
                    </p>
                  </li>
                  <li><span><i>*</i> tipo de robot：</span>
                    <p>
                      <RadioGroup v-model="robotType">
                        <Radio label="0"><em>en general</em></Radio>
                        <Radio label="1"><em>Panel de control</em></Radio>
                      </RadioGroup>
                    </p>
                  </li>
                </ul>
              </Row>
            </Col>
          </Row>
      </Modal>

      <Table
        border
        :columns="columns_first"
        :data="exchange"
        @on-selection-change="selected"
        :loading="ifLoading">
      </Table>

      <Row class="pageWrapper">
        <Page
        :total="pageNum"
        class="buttomPage"
        :current="current"
        @on-change="changePage"
        show-elevator></Page>
      </Row>

      <p style="font-size:11px;">Nota 1: [Estado] = Fuera del estante, no importa si el estado de [Comerciable] es Sí o No, no se puede intercambiar y la recepción no lo muestra </p>
      <p style="font-size:11px;">Nota 2: [Estado] = En el estante, y [Tradeable] = Sí, se puede comerciar normalmente</p>
      <p style="font-size:11px;">Nota 3: [Estado] = Disponible y [Comerciable] = No, no disponible para comercio</p>
      <p style="font-size:11px;">Nota 4: [Estado] = En el estante y [Display] = Sí, se muestra en primer plano</p>
      <p style="font-size:11px;">Nota 5: [Estado] se usa para controlar el par comercial como un todo, a menos que el par comercial se elimine de la lista, siempre debe establecerse en el estado "listado"</ p>
      <p style="font-size:11px;">Nota 6: [Tradable] se usa para controlar si el par comercial enumerado se puede negociar. Esta situación generalmente se usa cuando se suspende el comercio o se mantiene el par comercial</p >
      <p style="font-size:11px;">Nota 7: [Display] se usa para controlar si el par comercial listado se muestra anteayer. Generalmente se usa para algunos trabajos preparatorios antes de que el par comercial entre en línea. como iniciar el motor de negociación y el motor de cotización de mercado, etc.</p>
      <p style="font-size:11px;">Nota 8: Antes de iniciar el motor, se debe establecer el estado del par comercial: [Estado] = Listado</p>
      <p style="font-size:11px;">Nota 9: antes de detener el motor, se debe establecer el estado del par comercial: [Tradeable] = Sí</p>
      <p style="font-size:11px;">Nota 10: Antes de cancelar todos los pedidos, el estado de [Trade Engine] y [Market Engine] debe estar "en ejecución" al mismo tiempo, y [Tradeable] = No, debe configurarse. Y espere unos minutos para asegurarse de que se procesen las órdenes acumuladas (puede juzgar comprobando los cambios en la cantidad de órdenes en el estado de la orden del motor comercial)</p>
      <p style="font-size:11px;">Nota 11: Al crear una nueva moneda, [Display] se establece en oculto, [Tradable] se establece en deshabilitado y luego inicie el motor, espere a que el motor de mercado inicio, y luego configure [ Display] como visible. De lo contrario, el front-end no podrá obtener la lista de transacciones</p>
      <hr>
      <p style="font-size:11px;">Cotización de intercambio externo: https://api.bizzan.pro/ermarket/thumb/btcusdt</p>
      <p style="font-size:11px;">Obtenga todas las configuraciones de robots: https://api.bizzan.pro/ernormal/robotList</p>
      <Modal
        v-model="ifDelete"
        title="eliminar par comercial"
        @on-ok="confirmDel"
        @on-cancel="$Message.info('Cancelado！')">
        <p>Ya sea para eliminar el seleccionado{{ deleteArr.length }}项</p>
       </Modal>
			 <Modal
					class="auditModel"
					v-model="loginPassModal"
					title="Por favor, introduzca su contraseña"
					width="350"
					@on-cancle="loginPW = ''"
					@on-ok="confirmLoginPass">
					<Input v-model="loginPW" type="password" placeholder="Por favor, introduzca su contraseña"></Input>
			 </Modal>

       <Modal
          class="auditModel"
          v-model="startEngineModel"
          title="Inicie el motor de transacciones coincidentes para confirmar"
          width="350"
          @on-cancle="$Message.info('Cancelado！')"
          @on-ok="confirmClicked">
          <p style="font-size:20px;font-weight:bold;text-align:center;">Iniciar transacción coincidente：<span style="color: #FF0000;">{{targetSymbol}}</span></p>
          <p style="font-size:12px;text-align:center;margin-top: 10px;">¿Está seguro de iniciar el motor de coincidencia para este par comercial?</p>
       </Modal>

       <Modal
          class="auditModel"
          v-model="stopEngineModel"
          title="Dejar de coincidir con la confirmación del motor de transacciones"
          width="350"
          @on-cancle="$Message.info('Cancelado！')"
          @on-ok="confirmClicked">
          <p style="font-size:20px;font-weight:bold;text-align:center;">Dejar de conciliar transacciones：<span style="color: #FF0000;">{{targetSymbol}}</span></p>
          <p style="font-size:12px;text-align:center;margin-top: 10px;">¿Está seguro de que desea detener el motor de coincidencia para este par comercial??</p>
       </Modal>
       <Modal
          class="auditModel"
          v-model="cancelAllModel"
          title="Cancelar todas las confirmaciones de delegación"
          width="350"
          @on-cancle="$Message.info('Cancelado！')"
          @on-ok="confirmClicked">
          <p style="font-size:20px;font-weight:bold;text-align:center;">Cancelar todas las delegaciones：<span style="color: #FF0000;">{{targetSymbol}}</span></p>
          <p style="font-size:12px;text-align:center;margin-top: 10px;">¿Está seguro de que desea cancelar todos los pedidos de este par comercial??</p>
       </Modal>
       <Modal
          class="auditModel"
          v-model="resetModel"
          title="confirmación de reinicio del motor"
          width="350"
          @on-cancle="$Message.info('Cancelado！')"
          @on-ok="confirmClicked">
          <p style="font-size:20px;font-weight:bold;text-align:center;">restablecer el motor comercial：<span style="color: #FF0000;">{{targetSymbol}}</span></p>
          <p style="font-size:12px;text-align:center;margin-top: 10px;">¿Está seguro de que desea restablecer el motor comercial??</p>
       </Modal>

       <Modal
          class="auditModel"
          v-model="exchangeEngineModel"
          title="Detalles del pedido del motor de transacciones"
          width="350"
          @on-cancle="confirmExchangeEngineMoel"
          @on-ok="">
          <p style="font-size:20px;font-weight:bold;text-align:center;margin-bottom:20px;"><span style="color: #FF0000;">{{engineTargetSymbol}}</span></p>
          <Row :gutter="30">
            <Col span="12">
              <p style="font-size:14px;font-weight:bold;text-align:center;margin-bottom: 10px;padding-bottom:10px;border-bottom: 1px solid #B7B7B7;"><span>Descripción general de la orden de compra</span></p>
              <p style="font-size:12px;text-align:center;margin-top: 10px;">orden limitada de compra：{{engineLimitBuyCount}}</p>
              <p style="font-size:12px;text-align:center;margin-top: 10px;">orden de compra de mercado：{{engineMarketBuyCount}}</p>
              <p style="font-size:12px;text-align:center;margin-top: 10px;">profundidad de la orden de compra：{{engineBuyDepth}}</p>
            </Col>
            <Col span="12">
              <p style="font-size:14px;font-weight:bold;text-align:center;margin-bottom: 10px;padding-bottom:10px;border-bottom: 1px solid #B7B7B7;"><span>Descripción general de la orden de venta</span></p>
              <p style="font-size:12px;text-align:center;margin-top: 10px;">Vender orden limitada：{{engineLimitSellCount}}</p>
              <p style="font-size:12px;text-align:center;margin-top: 10px;">Vender orden limitada：{{engineMarketSellCount}}</p>
              <p style="font-size:12px;text-align:center;margin-top: 10px;">Profundidad de la orden de venta：{{engineSellDepth}}</p>
            </Col>
          </Row>
       </Modal>

       <Modal
          class="auditModel"
          v-model="robotModel"
          title="Modificar los parámetros del robot"
          @on-ok="alterRobotClicked">
          <ul>
            <li><span><i>*</i>par comercial：</span>
              <p>
                <Input v-model="robotParams.symbol" disabled></Input>
                <span>{{ }}</span>
              </p>
            </li>
            <li><span><i>*</i> Iniciar el bot：</span>
              <p>
                <RadioGroup v-model="robotParams.isHalt">
                  <Radio label="1"><em>deténgase</em></Radio>
                  <Radio label="0"><em>puesta en marcha</em></Radio>
                </RadioGroup>
              </p>
            </li>
            <li>
                <span><i>*</i>Volumen mínimo de transacciones：</span>
                <p> <Input v-model="robotParams.startAmount"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(1%)：</span>
                <p> <Input v-model="robotParams.randRange0"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(9%)：</span>
                <p> <Input v-model="robotParams.randRange1"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(20%)：</span>
                <p> <Input v-model="robotParams.randRange2"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(20%)：</span>
                <p> <Input v-model="robotParams.randRange3"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(20%)：</span>
                <p> <Input v-model="robotParams.randRange4"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(20%)：</span>
                <p> <Input v-model="robotParams.randRange5"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(10%)：</span>
                <p> <Input v-model="robotParams.randRange6"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Requisitos de precisión de precios：</span>
                <p> <Input v-model="robotParams.scale"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Requisitos de precisión de cantidad：</span>
                <p> <Input v-model="robotParams.amountScale"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Diferencial máximo entre oferta y demanda：</span>
                <p> <Input v-model="robotParams.maxSubPrice"></Input> </p>
            </li>
            <li>
                <span><i>*</i>número de pedidos iniciales(>24)：</span>
                <p> <Input v-model="robotParams.initOrderCount"></Input> </p>
            </li>
            <li>
                <span><i>*</i>paso de cambio de precio(%)：</span>
                <p> <Input v-model="robotParams.priceStepRate"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Intervalo de tiempo de pedido(ms)：</span>
                <p> <Input v-model="robotParams.runTime"></Input> </p>
            </li>
          </ul>
      </Modal>

      <Modal
          class="auditModel"
          v-model="priceRobotModel"
          title="(Robot de fijación de precios) Modificar parámetros del robot"
          @on-ok="alterPriceRobotClicked">
          <ul>
            <li><span><i>*</i>par comercial：</span>
              <p>
                <Input v-model="priceRobotParams.symbol" disabled></Input>
                <span>{{ }}</span>
              </p>
            </li>
            <li><span><i>*</i> Iniciar el bot：</span>
              <p>
                <RadioGroup v-model="priceRobotParams.isHalt">
                  <Radio label="1"><em>deténgase</em></Radio>
                  <Radio label="0"><em>puesta en marcha</em></Radio>
                </RadioGroup>
              </p>
            </li>

            <li>
                <span><i>*</i>Precio fijo：</span>
                <p> <Input v-model="priceRobotParams.price"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen mínimo de transacciones：</span>
                <p> <Input v-model="priceRobotParams.startAmount"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(1%)：</span>
                <p> <Input v-model="priceRobotParams.randRange0"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(9%)：</span>
                <p> <Input v-model="priceRobotParams.randRange1"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(20%)：</span>
                <p> <Input v-model="priceRobotParams.randRange2"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(20%)：</span>
                <p> <Input v-model="priceRobotParams.randRange3"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(20%)：</span>
                <p> <Input v-model="priceRobotParams.randRange4"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(20%)：</span>
                <p> <Input v-model="priceRobotParams.randRange5"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Volumen estocástico(10%)：</span>
                <p> <Input v-model="priceRobotParams.randRange6"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Requisitos de precisión de precios：</span>
                <p> <Input v-model="priceRobotParams.scale"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Requisitos de precisión de cantidad：</span>
                <p> <Input v-model="priceRobotParams.amountScale"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Diferencial máximo entre oferta y demanda：</span>
                <p> <Input v-model="priceRobotParams.maxSubPrice"></Input> </p>
            </li>
            <li>
                <span><i>*</i>número de pedidos iniciales(>24)：</span>
                <p> <Input v-model="priceRobotParams.initOrderCount"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Paso de cambio de precio (%):</span>
                <p> <Input v-model="priceRobotParams.priceStepRate"></Input> </p>
            </li>
            <li>
                <span><i>*</i>Intervalo de tiempo de pedido (milisegundos):</span>
                <p> <Input v-model="priceRobotParams.runTime"></Input> </p>
            </li>
          </ul>
      </Modal>
    </Card>
 </div>
</template>

 <script>
import dtime from 'time-formater'
import { transactionPair } from '@/caculate/caculate'
import { delBBSetting, addBBSetting, queryBBSetting, fixBBSetting, startBBTrader, stopBBTrader, cancelBBAllOrders, overviewBB, getRobotConfig, setRobotConfig, createRobotConfig, createPriceRobotConfig, setPriceRobotConfig, resetBBTrader} from '@/service/getData'

export default {
  data() {
    return {
			loginPW: '',
			loginPassModal: false,
      ifLoading: true,
      // currentPageIdx: 1,
      coinScaleClass: false,
      baseSymbolClass: false,
      checkSymbolClass: false,
      coinSymbolClass: false,
      feeClass: false,
      baseCoinScaleClass: false,
      minVolumeClass: false,
      maxVolumeClass: false,
      zoneClass: false,
      minSellPriceClass: false,
      maxBuyPriceClass: false,
      minTurnoverClass: false,
      sortClass: false,
      publishPriceClass: false,

      operation: 1, // 1: 设置   2：启动引擎   3：停止引擎   4：撤销委托

      fixSymbol: null,
      fixEnable: 1,
      fixModel: false,
      fixSort: null,
      fixVisible: 1,
      fixExchangeable: 1,
      fixEnableMarketSell: "1",
      fixEnableMarketBuy: "1",
      fixEnableBuy: "1",
      fixEnableSell: "1",
      fixMaxBuyPrice: null,
      fixMinTurnover: null,

      startEngineModel: false,
      stopEngineModel: false,
      cancelAllModel: false,
      targetSymbol: null,
      resetModel: false,

      searchSymbol: "",
      searchBase: "",

      robotModel: false,
      robotMode: 0,
      robotParams: {
        symbol: "",
        isHalt: "1",
        startAmount: 0,
        randRange0: 0,
        randRange1: 0,
        randRange2: 0,
        randRange3: 0,
        randRange4: 0,
        randRange5: 0,
        randRange6: 0,
        scale: 0,
        amountScale: 0,
        maxSubPrice: 0,
        initOrderCount: 0,
        priceStepRate: 0,
        runTime: 0
      },
      defaultRobotParams: {
        symbol: "",
        isHalt: "1",
        startAmount: 0.001,
        randRange0: 50,
        randRange1: 20,
        randRange2: 10,
        randRange3: 5,
        randRange4: 1,
        randRange5: 0.1,
        randRange6: 0.01,
        scale: 4,
        amountScale: 6,
        maxSubPrice: 1,
        initOrderCount: 30,
        priceStepRate: 0.005,
        runTime: 20000
      },
      priceRobotModel: false,
      priceRobotMode: 0,
      priceRobotParams: {
        symbol: "",
        isHalt: "1",
        startAmount: 0,
        randRange0: 0,
        randRange1: 0,
        randRange2: 0,
        randRange3: 0,
        randRange4: 0,
        randRange5: 0,
        randRange6: 0,
        scale: 0,
        price: 0,
        amountScale: 0,
        maxSubPrice: 0,
        initOrderCount: 0,
        priceStepRate: 0,
        runTime: 0
      },
      defaultPriceRobotParams: {
        symbol: "",
        isHalt: "1",
        startAmount: 0.001,
        randRange0: 50,
        randRange1: 20,
        randRange2: 10,
        randRange3: 5,
        randRange4: 1,
        randRange5: 0.1,
        randRange6: 0.01,
        scale: 4,
        amountScale: 6,
        price: 1,
        maxSubPrice: 1,
        initOrderCount: 30,
        priceStepRate: 0.005,
        runTime: 20000
      },
      symbol: null,
      coinSymbol: null,
      baseSymbol: null,
      enable: "1",
      fee: null,
      coinScale: null,
      baseCoinScale: null,
      minVolume: null, // add
      maxVolume: null, // add
      zone: null, // add
      minSellPrice: null, // add
      maxBuyPrice: null, // add
      minTurnover: null, // add
      sort: null, // add
      publishPrice: null,
      publishType: "1",
      publishAmount: 0,
      startTime: null,
      endTime: null,
      clearTime: null,
      visible: "1",
      exchangeable: "1",
      robotType: "0",
      enableMarketBuy: "1",
      enableMarketSell: "1",
      enableBuy: "1",
      enableSell: "1",

      auditModal: false,
      pageNum: null,
      current: 1,
      deleteArr: false,
      ifDelete: false,

      exchangeEngineModel: false,
      engineTargetSymbol: "",
      engineLimitSellCount: "",
      engineLimitBuyCount: "",
      engineMarketSellCount: "",
      engineMarketBuyCount: "",
      engineBuyDepth: 0,
      engineSellDepth: 0,
      columns_first: [
        {
          type: "selection",
          width: 55,
          align: 'center'
        },
        {
          title: "#",
          width: 50,
          type: "index"
        },
        {
          title: "par comercial",
          width: 120,
          key: "symbol",
          render: (h, params) => {
            const row = params.row;
            return h("div", {
                style:{
                  textAlign: "left"
                }
              }, [
                h("span", {style:{fontWeight:"bold"}}, row.symbol)
              ]);
          }
        },
        {
          title: "precio de mercado",
          width: 65,
          key: "fee",
          render: (h, params) => {
            const row = params.row;
            const marketBuyText = row.enableMarketBuy == 1 ? "☑" : "✖";
            const marketSellText = row.enableMarketSell == 1 ? "☑" : "✖";
            return h("div", {
                style:{
                  textAlign: "center"
                }
              }, [
                h("span", {style:{fontSize:"10px"}}, "" + marketBuyText + " / " + marketSellText)
              ]);
          }
        },
        {
          title: "comerciable",
          width: 65,
          key: "fee",
          render: (h, params) => {
            const row = params.row;
            const marketBuyText = row.enableBuy == 1 ? "☑" : "✖";
            const marketSellText = row.enableSell == 1 ? "☑" : "✖";
            return h("div", {
                style:{
                  textAlign: "center"
                }
              }, [
                h("span", {style:{fontSize:"10px"}}, "" + marketBuyText + " / " + marketSellText)
              ]);
          }
        },
        {
          title: "mostrar",
          width:45,
          key: "visible",
          render: (h, params) => {
            const row = params.row;
            const visible = row.visible == "1" ? "Si" : "No";
            if(row.visible == "1") {
              return h("span", {
                style:{
                  color:'#42b983'
                }
              }, visible);
            }
            return h("span", {
              style:{
                  color:'#FF0000'
                }
            }, visible);
          }
        },
        {
          title: "Nego.",
          width: 35,
          key: "exchangeable",
          render: (h, params) => {
            const row = params.row;
            const exchangeable = row.exchangeable == "1" ? "Sí" : "No";
            if(row.exchangeable == "1") {
              return h("span", {
                style:{
                  color:'#42b983'
                }
              }, exchangeable);
            }
            return h("span", {
              style:{
                  color:'#FF0000'
                }
            }, exchangeable);
          }
        },
        {
          title: "robot",
          width: 60,
          key: "robotType",
          render: (h, params) => {
            const row = params.row;
            var robot = "en general";
            if(row.robotType == "1"){
              robot = "Panel de control";
            }
            return h("span", {
              style:{
                color:'#42b983'
              }
            }, robot);
          }
        },{
          title: "Parámetros de robots",
          width: 80,
          key: "engineStatus",
          render: (h, params) => {
            const row = params.row;
            var btnType = row.exEngineStatus == 1 ? "primary" : "default";
            var btnText = row.exEngineStatus == 1 ? "configurar" : "nuevo";
            return h("div", [
              h(
                "Button",
                  {
                    props: {type: btnType, size: "small"},
                    style: {marginRight: "5px"},
                    on: {
                      click: () => {
                        this.$Loading.start();

                        this.robotMode = row.exEngineStatus; // 0:创建   1:修改

                        let obj ={
                          symbol:  row.symbol
                        }
                        getRobotConfig(obj).then( res => {
                          if (!res.code) {
                              this.robotParams.symbol = row.symbol;
                              if(res.data.halt) {
                                this.robotParams.isHalt = "1";
                              }else{
                                this.robotParams.isHalt = "0";
                              }
                              this.robotParams.startAmount = res.data.startAmount;
                              this.robotParams.randRange0 = res.data.randRange0;
                              this.robotParams.randRange1 = res.data.randRange1;
                              this.robotParams.randRange2 = res.data.randRange2;
                              this.robotParams.randRange3 = res.data.randRange3;
                              this.robotParams.randRange4 = res.data.randRange4;
                              this.robotParams.randRange5 = res.data.randRange5;
                              this.robotParams.randRange6 = res.data.randRange6;
                              this.robotParams.scale = res.data.scale;
                              this.robotParams.amountScale = res.data.amountScale;
                              this.robotParams.maxSubPrice = res.data.maxSubPrice;
                              this.robotParams.initOrderCount = res.data.initOrderCount;
                              this.robotParams.priceStepRate = res.data.priceStepRate;
                              this.robotParams.runTime = res.data.runTime;

                              this.robotModel = true;
                              this.$Loading.finish();
                          }else{
                              this.robotParams = this.defaultRobotParams;
                              this.robotParams.symbol = row.symbol;
                              this.robotModel = true;
                              this.$Notice.info({
                                    title: "crear un bot",
                                    desc: "No hay bots para este par comercial",
                                    duration: 10
                                });
                              this.$Loading.finish();
                          }
                        });
                      }
                    }
                  },
                  btnText
                )
            ]);
          }
        },
        {
          title: "motor comercial",
          width: 100,
          key: "engineStatus",
          render: (h, params) => {
            const row = params.row;
            var engineStatus = "sin motor";
            if(row.engineStatus == "1"){
              engineStatus = "correr";
            }
            if(row.engineStatus == "2"){
              engineStatus = "Pausa";
            }
            if(row.engineStatus == "1") {
              return h(
                "Button",
                  {
                    props: {type: "success",size: "small", icon:"ios-information-outline"},
                    style: {marginRight: "5px"},
                    on: {
                      click: () => {
                        this.$Loading.start();

                        this.engineLimitBuyCount = "-";
                        this.engineMarketBuyCount = "-";
                        this.engineLimitSellCount = "-";
                        this.engineMarketSellCount = "-";
                        this.engineBuyDepth = "-";
                        this.engineSellDepth = "-";

                        this.exchangeEngineModel = true;
                        this.engineTargetSymbol = params.row.symbol;

                        let obj ={
                          symbol:  this.engineTargetSymbol
                        }
                        overviewBB(obj).then( res => {
                          if (!res.code) {

                            this.engineLimitBuyCount = res.data.bid.limit_price_order_count;
                            this.engineMarketBuyCount = res.data.bid.market_price_order_count;
                            this.engineLimitSellCount = res.data.ask.limit_price_order_count;
                            this.engineMarketSellCount = res.data.ask.market_price_order_count;
                            this.engineBuyDepth = res.data.bid.depth;
                            this.engineSellDepth = res.data.ask.depth;

                            this.$Loading.finish();
                          }else{
                            this.$Notice.error({
                                  title: "Obtener fallido",
                                  desc: res.message,
                                  duration: 10
                              });
                            this.$Loading.error();
                          }
                        });
                      }
                    }
                  },
                  engineStatus
                );
            }
            return h("div", {
              style:{
                  color:'#FF0000',
                  borderRadius: "4px",
                  border: "1px solid #FF0000",
                  padding: "2px 4px",
                  fontSize:"11px"
                }
            }, engineStatus);
          }
        },
        {
          title: "Motor de cotizaciones",
          width: 100,
          key: "engineStatus",
          render: (h, params) => {
            const row = params.row;
            var marketEngineStatus = "sin motor";
            if(row.marketEngineStatus == "1"){
              marketEngineStatus = "correr";
            }
            if(row.marketEngineStatus == "2"){
              marketEngineStatus = "Pausa";
            }

            if(row.marketEngineStatus == "1" && row.engineStatus == "2") {
              return h("div", [
              h(
                "Button",
                {
                  props: {type: "error",size: "small", loading:true},
                  style: {marginRight: "5px"},
                },
                "停止中"
              )]);
            }

            if(row.marketEngineStatus == "1") {
              return h("div", {
                    style:{
                      color:'#19be6b',
                      borderRadius: "4px",
                      border: "1px solid #19be6b",
                      padding: "2px 8px",
                      fontSize:"11px",
                      display: "inline-block"
                    }
                  },
                  marketEngineStatus
                );
            }

            if(row.marketEngineStatus == "2" && row.engineStatus == "1"){
              return h("div", [
              h(
                "Button",
                {
                  props: {type: "success",size: "small", loading:true},
                  style: {marginRight: "5px"},
                },
                "启动中"
              )]);
            }
            return h("div", {
              style:{
                  color:'#FF0000',
                  borderRadius: "4px",
                  border: "1px solid #FF0000",
                  padding: "2px 8px",
                  fontSize:"11px",
                  display: "inline-block"
                }
            }, marketEngineStatus);
          }
        },
        {
          title: "estado",
          width: 70,
          key: "enable",
          render: (h, params) => {
            const row = params.row;
            const enable = row.enable == "1" ? "en la repisa" : "Derribar";
            if(row.enable == "1") {
              return h("span", {
                style:{
                  color:'#42b983'
                }
              }, enable);
            }
            return h("span", {
              style:{
                  color:'#FF0000'
                }
            }, enable);
          }
        },
        {
          title: 'clasificar',
          key:"sort",
          width: 60
        },
        {
          title: "Actividad de emisión",
          width: 150,
          key: "publishType",
          render: (h, params) => {
            const row = params.row;
            const currentTime = dtime(row.currentTime).format('YYYY-MM-DD HH:mm:ss');
            var publishType = "未知";
            const txtColor = currentTime > row.clearTime ? "#B7B7B7" : "#42b983";

            if(row.publishType == "NONE"){
              publishType = "ninguna actividad";
            }
            if(row.publishType == "QIANGGOU"){
              publishType = currentTime > row.clearTime ? "Compra instantánea (cerrada)" : "Complemento (en curso)";
            }
            if(row.publishType == "FENTAN"){
              publishType = currentTime > row.clearTime ? "reparto (cerrado)" : "Asignación (en curso)";
            }

            if(row.publishType == "QIANGGOU" || row.publishType == "FENTAN") {
                if(currentTime > row.clearTime){
                    return h("div", {
                      style:{
                        color: txtColor,
                        textAlign: "center"
                      }
                    }, [
                      h("span", {}, publishType)
                    ]);
                }else{
                    return h("div", {
                      style:{
                        color: txtColor,
                        textAlign: "left"
                      }
                    }, [
                      h("span", {}, publishType),
                      h("br", {}, ""),
                      h("span", {style:{fontSize:"8px"}}, "开始："+params.row.startTime.substr(0, 16)),
                      h("br", {}, ""),
                      h("span", {style:{fontSize:"8px"}}, "结束："+params.row.endTime.substr(0, 16)),
                      h("br", {}, ""),
                      h("span", {style:{fontSize:"8px"}}, "盘整："+params.row.clearTime.substr(0, 16))
                    ]);
                }
            }
            return h("span", {
              style:{
                  color:'#b7b7b7'
                }
            }, publishType);
          }
        },
        {
          title: "tasa de tramitación",
          width: 80,
          key: "symbol",
          render: (h, params) => {
            const row = params.row;
            return h("div", {
                style:{
                  textAlign: "center"
                }
              }, [
                h("span", {}, (row.fee * 1000 + "‰"))
              ]);
          }
        },
        {
          title: "recomendar",
          key: "flag",
          width: 60,
          render: (h, params) => {
            const row = params.row;
            const aFlag = row.flag === 1 ? "√" : "×";
            return h("span", {}, aFlag);
          }
        },
        {
          title: 'Precisión de moneda',
          key:"coinScale",
          width: 90
        },
        {
          title: 'Precisión de moneda base',
          key:"baseCoinScale",
          width: 90
        },
        {
          title: 'Facturación mínima',
          key:"minTurnover",
          width: 100
        },
        {
          title: 'Cantidad mínima de pedido',
          key:"minVolume",
          width: 100
        },
        {
          title: 'Cantidad máxima de pedido',
          key:"maxVolume",
          width: 100
        },
        {
          title: 'Precio más bajo para orden de venta',
          key:"minSellPrice",
          width: 100
        },
        {
          title: 'Precio máximo de la orden de compra',
          key:"maxBuyPrice",
          width: 100
        },
        {
          title: "funcionar",
          key: "xx",
          width: 330,
          fixed: 'right',
          render: (h, obj) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {type: "info",size: "small",icon:"android-settings"},
                  style: {marginRight: "5px"},
                  on: {
                    click: () => {
                      this.operation = 1;
                      this.fixModel = true;
                      this.fixSymbol = obj.row.symbol;
                      this.fee = obj.row.fee;
                      this.fixMaxBuyPrice = obj.row.maxBuyPrice;
                      this.fixMinTurnover = obj.row.minTurnover;
                      this.fixSort = obj.row.sort;
                      this.fixEnable = String(obj.row.enable);
                      this.fixVisible = String(obj.row.visible);
                      this.fixExchangeable = String(obj.row.exchangeable);
                      this.fixEnableMarketBuy = String(obj.row.enableMarketBuy);
                      this.fixEnableMarketSell = String(obj.row.enableMarketSell);
                      this.fixEnableBuy = String(obj.row.enableBuy);
                      this.fixEnableSell = String(obj.row.enableSell);
                    }
                  }
                },
                "configurar"
              ),
              h(
                "Button",
                {
                  props: {type: "success",size: "small", icon:"ios-play"},
                  style: {marginRight: "5px", display: obj.row.engineStatus == "1" ? "none" : "inline-block"},
                  on: {
                    click: () => {
                      this.operation = 2;
                      this.startEngineModel = true;
                      this.targetSymbol = obj.row.symbol;
                    }
                  },
                  key: 'loading'
                },
                "Encender el motor"
              ),
              h(
                "Button",
                {
                  props: {type: "error",size: "small", icon:"stop"},
                  style: {marginRight: "5px", display: obj.row.engineStatus != "1" ? "none" : "inline-block"},
                  on: {
                    click: () => {
                      this.operation = 3;
                      this.stopEngineModel = true;
                      this.targetSymbol = obj.row.symbol;
                    }
                  }
                },
                "detener el motor"
              ),
              h(
                "Button",
                {
                  props: {type: "warning",size: "small"},
                  style: {marginRight: "5px"},
                  on: {
                    click: () => {
                      if(obj.row.engineStatus != "1"){
                        this.$Notice.error({
                            title: "Error al revocar todas las delegaciones",
                            desc: "Cancele la orden cuando el estado del motor comercial sea [En ejecución].",
                            duration: 10
                        });
                        return;
                      }
                      if(obj.row.exchangeable == "1"){
                        this.$Notice.error({
                            title: "Error al revocar todas las delegaciones",
                            desc: "Establezca el estado [Intercambiable] del par comercial en No y luego espere un minuto antes de operar",
                            duration: 10
                        });
                        return;
                      }
                      this.operation = 4;
                      this.cancelAllModel = true;
                      this.targetSymbol = obj.row.symbol;
                    }
                  }
                },
                "Cancelar todas las delegaciones"
              ),
              h(
                "Button",
                {
                  props: {type: "default",size: "small"},
                  style: {marginRight: "5px"},
                  on: {
                    click: () => {
                      if(obj.row.exchangeable != "1"){
                        this.$Notice.error({
                            title: "mensaje de reinicio",
                            desc: "Establezca el estado [intercambiable] del par comercial en \"Sí\"",
                            duration: 10
                        });
                        return;
                      }
                      this.operation = 5;
                      this.resetModel = true;
                      this.targetSymbol = obj.row.symbol;
                    }
                  }
                },
                "reiniciar el motor"
              )
            ]);
          }
        }
      ],
      exchange: []
    };
  },
  methods: {
    checkbaseCoinScale(str) {
      let bol = !(str*1>=0&&String(str).split('.').length===1)
                || str===null || !str.trim().length;
      this.baseCoinScaleClass =  bol;
    },
    checkCoinScale(str) {
      let bol = !(str*1>=0&&String(str).split('.').length===1)
                || str===null || !str.trim().length;
      this.coinScaleClass =  bol;
    },
    checkFee(str) {
      let re = /\d|\d+.\d+$/g;
      this.feeClass = !re.test(String(str)) || !(str*1>0);
    },
    checkbaseSymbol(str) {
      let re = /[^A-Z]/g;
      this.baseSymbolClass =  re.test(str);
    },
    checkCoinSymbol(str) {
      let re = /[^A-Z]/g;
      this.coinSymbolClass =  re.test(str);
    },
    checkPair(str) {
     let re = /^[A-Z]+\/[A-Z]+$/g;
      this.checkSymbolClass = !re.test(str);
      console.log(this.checkSymbolClass);
		},
    checkminVolume(str) {
      let re = /\d|\d+.\d+$/g;
      this.minVolumeClass = !re.test(String(str));
    },
    checkmaxVolume(str) {
      let re = /\d|\d+.\d+$/g;
      this.maxVolumeClass = !re.test(String(str));
    },
    checkzone(str) {
      let bol = !(str*1>=0&&String(str).split('.').length===1)
                || str===null || !str.trim().length;
      this.zoneClass =  bol;
    },
    checkminSellPrice(str) {
      let re = /\d|\d+.\d+$/g;
      this.minSellPriceClass = !re.test(String(str));
    },
    checkmaxBuyPrice(str) {
      let re = /\d|\d+.\d+$/g;
      this.maxBuyPriceClass = !re.test(String(str));
    },
    checkminTurnover(str) {
      let re = /\d|\d+.\d+$/g;
      this.minTurnoverClass = !re.test(String(str));
    },
    checksort(str) {
      let bol = !(str*1>=0&&String(str).split('.').length===1)
                || str===null || !str.trim().length;
      this.sortClass =  bol;
    },
    checkpublishPrice(str) {
      let re = /\d|\d+.\d+$/g;
      this.publishPriceClass = !re.test(String(str));
    },
    confirmExchangeEngineMoel(){
      this.exchangeEngineModel = false;
    },
		confirmLoginPass() {
      this.$Loading.start();
      if(this.operation == 1){
          // 修改币币信息
  			  this.feeClass = false;
          let obj ={
            symbol:  this.fixSymbol,
            fee: this.fee,
  					enable: this.fixEnable,
            visible: this.fixVisible,
            exchangeable: this.fixExchangeable,
            enableMarketSell: this.fixEnableMarketSell,
            enableMarketBuy: this.fixEnableMarketBuy,
            enableSell: this.fixEnableSell,
            enableBuy: this.fixEnableBuy,
            maxBuyPrice: this.fixMaxBuyPrice,
            minTurnover: this.fixMinTurnover,
            sort: this.fixSort,
  					password: this.loginPW
  				}

          fixBBSetting(obj).then( res => {
            if (!res.code) {
  						this.$Message.success('Modificado con éxito！');
              this.current = 1;
              this.refreshdata(1);
              this.$Loading.finish();
            }else {
              this.$Message.error('fallar al editar！');
              this.$Loading.error();
            }
          });
      }else if(this.operation == 2){
          // 启动交易引擎
          let obj ={
            symbol:  this.targetSymbol,
            password: this.loginPW
          }

          startBBTrader(obj).then( res => {
            if (!res.code) {
              this.$Notice.success({
                    title: "【" + this.targetSymbol+ '】  Comenzó con éxito，Actualiza para ver los resultados！',
                    desc: res.message+" El motor del mercado se iniciará en 2 minutos.。",
                    duration: 10
                });
              this.current = 1;
              this.refreshdata(1);
              this.$Loading.finish();
            }else{
              this.$Notice.error({
                    title: "【" + this.targetSymbol+ '】  no se pudo activar',
                    desc: res.message,
                    duration: 10
                });
              this.$Loading.error();
            }
          });

      }else if(this.operation == 3){

          let obj ={
            symbol:  this.targetSymbol,
            password: this.loginPW
          }

          stopBBTrader(obj).then( res => {
            if (!res.code) {
              this.$Notice.success({
                    title: "【" + this.targetSymbol+ '】  detener el éxito！',
                    desc: res.message+" El motor del mercado se detendrá en 2 minutos.。",
                    duration: 10
                });
              this.current = 1;
              this.refreshdata(1);
              this.$Loading.finish();
            }else{
              this.$Notice.error({
                    title: "【" + this.targetSymbol+ '】  parada fallida',
                    desc: res.message,
                    duration: 10
                });
              this.$Loading.error();
            }
          });
      }else if(this.operation == 4){
          // 撤销所有委托
          let obj ={
            symbol:  this.targetSymbol,
            password: this.loginPW
          }
          cancelBBAllOrders(obj).then( res => {
            if (!res.code) {
              this.$Notice.success({
                    title: "【" + this.targetSymbol+ '】  Deshacer exitoso！',
                    desc: res.message,
                    duration: 10
                });
              this.current = 1;
              this.refreshdata(1);
              this.$Loading.finish();
            }else{
              this.$Notice.error({
                    title: "【" + this.targetSymbol+ '】  Deshacer fallido',
                    desc: res.message,
                    duration: 10
                });
              this.$Loading.error();
            }
          });
      }else if(this.operation == 5) {

          let obj ={
            symbol:  this.targetSymbol,
            password: this.loginPW
          }
          resetBBTrader(obj).then( res => {
            if (!res.code) {
              this.$Notice.success({
                    title: "【" + this.targetSymbol+ '】  restablecer con éxito！',
                    desc: res.message,
                    duration: 10
                });
              this.current = 1;
              this.refreshdata(1);
              this.$Loading.finish();
            }else{
              this.$Notice.error({
                    title: "【" + this.targetSymbol+ '】  reinicio fallido',
                    desc: res.message,
                    duration: 10
                });
              this.$Loading.error();
            }
          });
      }
		},
    alterRobotClicked(){
      if(this.robotMode == 0) {
        // 创建机器人
        createRobotConfig(this.robotParams).then( res => {
            if(!res.code) {
              this.$Notice.success({
                      title: "创建成功！",
                      desc: res.message,
                      duration: 10
                  });
              this.robotModel = false;
              this.refreshdata(1);
            }else{
              this.$Notice.error({
                      title: "Fallo al crear",
                      desc: res.message,
                      duration: 10
                  });
              }
          });
      }else{
        setRobotConfig(this.robotParams).then( res => {
            if(!res.code) {
              this.$Notice.success({
                      title: "Modificado con éxito！",
                      desc: res.message,
                      duration: 10
                  });
              this.robotModel = false;
              this.refreshdata(1);
            }else{
              this.$Notice.error({
                      title: "fallar al editar",
                      desc: res.message,
                      duration: 10
                  });
              }
          });
      }
    },
    alterPriceRobotClicked(){
      if(this.priceRobotMode == 0) {
        // 创建机器人
        createPriceRobotConfig(this.priceRobotParams).then( res => {
            if(!res.code) {
              this.$Notice.success({
                      title: "Creado con éxito！",
                      desc: res.message,
                      duration: 10
                  });
              this.robotModel = false;
              this.refreshdata(1);
            }else{
              this.$Notice.error({
                      title: "Fallo al crear",
                      desc: res.message,
                      duration: 10
                  });
              }
          });
      }else{
        setPriceRobotConfig(this.priceRobotParams).then( res => {
            if(!res.code) {
              this.$Notice.success({
                      title: "Modificado con éxito！",
                      desc: res.message,
                      duration: 10
                  });
              this.priceRobotModel = false;
              this.refreshdata(1);
            }else{
              this.$Notice.error({
                      title: "fallar al editar",
                      desc: res.message,
                      duration: 10
                  });
              }
          });
      }
    },
    confirmClicked() {
			this.loginPassModal =  true;
    },
    confirmAudit() {
      let judgeCondition = this.baseCoinScaleClass || this.coinScaleClass || this.feeClass ||
                  this.baseSymbolClass ||this.coinSymbolClass ||this.checkSymbolClass || this.minVolumeClass || this.maxVolumeClass ||
                  this.zoneClass || this.minSellPriceClass || this.maxBuyPriceClass;
      let judgeEmpty = !this.symbol || !this.coinSymbol || !this.baseSymbol
                      || !this.fee || !this.coinScale || !this.baseCoinScale;

      if(judgeCondition || judgeEmpty) {
        this.$Message.warning('Ingresó información incorrecta！');
      } else {
        let obj= {
          symbol: this.symbol,
          coinSymbol: this.coinSymbol,
          baseSymbol: this.baseSymbol,
          enable: this.enable,
          fee: this.fee,
          coinScale: this.coinScale,
          baseCoinScale: this.baseCoinScale,
          minVolume: this.minVolume,
          maxVolume: this.maxVolume,
          zone: this.zone,
          minSellPrice: this.minSellPrice,
          maxBuyPrice: this.maxBuyPrice,
          minTurnover: this.minTurnover,
          sort: this.sort,
          publishPrice: this.publishPrice,
          publishType: this.publishType,
          publishAmount: this.publishAmount,
          startTime: dtime(this.startTime).format('YYYY-MM-DD HH:mm:ss'),
          endTime: dtime(this.endTime).format('YYYY-MM-DD HH:mm:ss'),
          clearTime: dtime(this.clearTime).format('YYYY-MM-DD HH:mm:ss'),
          visible: this.visible,
          robotType: this.robotType,
          exchangeable: this.exchangeable,
          enableMarketBuy: this.enableMarketBuy,
          enableMarketSell: this.enableMarketSell,
          enableBuy: this.enableBuy,
          enableSell: this.enableSell,
        }
        addBBSetting(obj).then( res => {
          if(!res.code) {
            this.$Notice.success({
                    title: "Agregado exitosamente！",
                    desc: res.message,
                    duration: 10
                });
            this.current = 1;
            this.refreshdata(1);
          }else{
            this.$Notice.error({
                    title: "agregar falló",
                    desc: res.message,
                    duration: 10
                });
          }
        })
      }
    },
    selected(selection) {
      this.deleteArr = [];
      selection.forEach(item => {
        this.deleteArr.push(item.symbol)
      });
    },
    confirmDel() {
      delBBSetting({ ids: this.deleteArr }).then( res =>{
        if(!res.code) {
          this.$Notice.success({
                    title: "eliminado con éxito！",
                    desc: res.message,
                    duration: 10
                });
          this.current = 1;
          this.refreshdata(1);
        }else {
          this.$Notice.error({
                    title: "no se pudo eliminar！",
                    desc: res.message,
                    duration: 10
                });
        }
      })
    },
    refreshPageManual() {
      this.ifLoading = true;
      this.refreshdata(this.current);
    },
    changePage(pageIndex) {
      this.ifLoading = true;
      this.current = pageIndex;
      this.refreshdata(pageIndex);
    },
    search(){
      this.refreshdata(1);
    },
    refreshdata(pageIndex) {

      queryBBSetting({ pageNo: pageIndex, pageSize: 50, coinSymbol: this.searchSymbol, baseSymbol: this.searchBase }).then( res => {
        this.exchange = res.data.content;
        this.pageNum = res.data.totalElements;
        this.ifLoading = false;
      });
    },
    delcoin() {
      if(!this.deleteArr.length) {
        this.$Message.warning('Ningún elemento seleccionado！');
      } else  this.ifDelete = true;
    },
    addcoin() {
      this.auditModal = true;

      this.symbol = null;
      this.coinSymbol = null;
      this.baseSymbol = null;
      this.enable = "1";
      this.fee = null;
      this.coinScale = null;
      this.baseCoinScal = null;
      this.minVolume = null;
      this.maxVolume = null;
      this.zone = null;
      this.minSellPrice = null;
      this.maxBuyPrice = null;
      this.minTurnover = null;
      this.sort = null;
      this.publishPrice = null; // add
      this.publishType = "1"; //
      this.publishAmount = 0;
      this.startTime = null;
      this.endTime = null;
      this.clearTime = null;
      this.visible = "1";
      this.robotType = "0";
      this.exchangeable = "1";
      this.enableMarketBuy = "1";
      this.enableMarketSell = "1";
      this.enableBuy = "1";
      this.enableSell = "1";
    },
  },
  created() {
    this.refreshdata(1);
  }
};
</script>

<style lang="less" scoped>
  .auditModel{
    ul {
      padding-left: 20px;
      li {
        position: relative;
        margin-bottom: 18px;
        span{
          position: absolute;
          top: 0;
          left: 0;
          display: inline-block;
          width: 95px;
          text-align: right;
          i{
            font-size: 14px;
            font-weight: 700;
            color: #ec0909;
          }
        }
        p{
          padding-left: 100px;
          min-width: 300px;
          line-height: 32px;
          em{
            position: static;
            color: unset;
          }
        }
      }
    }
  }
  .setting-title{
    font-size:14px;font-weight:bold;padding-bottom:20px;
  }
.auditModel ul li>em{
    position: absolute;
    bottom: -15px;
    font-size:10px;
    margin-left: 100px;
    line-height:12px;
    font-style: normal;
    color: #ec0909;
  }
</style>
