import { useCallback, useState } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap';
import NavComponent from './NavComponent/NavComponent';
import CustomFormTabContent from './CustomFormTabContent';
import CommonHeader from '../../../../../../../../../Common/CommonHeader';
import { CustomWizardFormPropsType } from '../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes';

interface CustomHorizontalWizardProps {
  heading: string
  horizontalWizardWrapperClassName?: string
  xs?: number
  firstXl?: number
  secondXl?: number,
  iscreateNewSaleLead: boolean;
  setIscreateNewSaleLead: any

}

const CustomHorizontalWizard = ({ heading, horizontalWizardWrapperClassName, xs, firstXl, secondXl, iscreateNewSaleLead,
  setIscreateNewSaleLead }: CustomHorizontalWizardProps) => {
  const [activeTab, setActiveTab] = useState<number | undefined>(1);
  const callback = useCallback((tab: number | undefined) => {
    setActiveTab(tab);
  }, []);
  return (
    <Col sm={12}>
      <Card>
        <CommonHeader title={heading} headClass='pb-0' />
        <CardBody>
          <div className={`horizontal-wizard-wrapper ${horizontalWizardWrapperClassName}`}>
            <Row className="g-3">
              <Col xl={firstXl} xs={xs} className="main-horizontal-header">
                <NavComponent callbackActive={callback} activeTab={activeTab} />
              </Col>
              <Col xl={secondXl} xs={xs}>
                <CustomFormTabContent activeTab={activeTab} callbackActive={callback} iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} />
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

export default CustomHorizontalWizard