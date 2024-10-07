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


}

const CustomHorizontalWizard = ({ heading, horizontalWizardWrapperClassName, xs, firstXl, secondXl }: CustomHorizontalWizardProps) => {
  const [activeTab, setActiveTab] = useState<number | undefined>(1);
  const callback = useCallback((tab: number | undefined) => {
    setActiveTab(tab);
  }, []);
  return (
    <Col sm={12}>
      
        <CommonHeader title={heading} headClass='pb-0' />
        
          <div className={`horizontal-wizard-wrapper ${horizontalWizardWrapperClassName}`}>
            <Row className="g-3">
              <Col xl={firstXl} xs={xs} className="main-horizontal-header">
                <NavComponent callbackActive={callback} activeTab={activeTab} />
              </Col>
              <Col xl={secondXl} xs={xs}>
                <CustomFormTabContent activeTab={activeTab} callbackActive={callback} />
              </Col>
            </Row>
          </div>
        
    
    </Col>
  )
}

export default CustomHorizontalWizard