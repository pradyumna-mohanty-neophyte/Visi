// import React, { useState, useEffect } from 'react';
// import { Camera, Barcode, CircuitBoard, CheckCircle2 } from 'lucide-react';

// const WorkflowStatus = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [completedStep, setCompletedStep] = useState(-1);
  
//   const getStepColor = (stepIndex, currentStep, completedStep) => {
//     if (stepIndex <= completedStep) return '#4CAF50';  // Green for completed
//     if (stepIndex === currentStep) return '#FFC107';  // Yellow for processing
//     if (stepIndex === currentStep && completedStep === stepIndex - 1) return '#f44336';  // Red for next
//     return '#E5E7EB';  // Gray for pending
//   };

//   const steps = [
//     { id: 0, title: 'Scan Barcode', icon: Barcode },
//     { id: 1, title: 'Camera Scan', icon: Camera },
//     { id: 2, title: 'Processing', icon: CircuitBoard },
//     { id: 3, title: 'Results Ready', icon: CheckCircle2 }
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentStep((prev) => {
//         if (prev < 3) {
//           setCompletedStep(prev);
//           return prev + 1;
//         }
//         setCompletedStep(-1);
//         return 0;
//       });
//     }, 3000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="w-full max-w-4xl mx-auto p-8 bg-gray-50 rounded-lg">
//       <div className="flex justify-between items-center relative">
//         {steps.map((step, index) => (
//           <div key={step.id} className="flex flex-col items-center w-1/4 relative">
//             {index < steps.length - 1 && (
//               <div className="absolute h-0.5 w-full top-6 left-1/2">
//                 <div className={`h-full`}
//                   style={{ 
//                     backgroundColor: getStepColor(index, currentStep, completedStep),
//                     transition: 'all 0.5s ease'
//                   }}
//                 />
//               </div>
//             )}
            
//             <div
//               className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center 
//                 transition-all duration-500"
//               style={{
//                 backgroundColor: getStepColor(index, currentStep, completedStep),
//                 boxShadow: currentStep === index ? '0 0 15px currentColor' : 'none',
//                 color: getStepColor(index, currentStep, completedStep)
//               }}
//             >
//               <step.icon className="w-6 h-6 text-white" />
//             </div>
            
//             <span className={`mt-2 text-sm font-medium
//               ${currentStep === index ? 'text-gray-800' : 'text-gray-500'}`}>
//               {step.title}
//             </span>
            
//             {currentStep === index && (
//               <div className="absolute z-0 w-12 h-12 rounded-full animate-ping opacity-25"
//                 style={{ backgroundColor: getStepColor(index, currentStep, completedStep) }} />
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WorkflowStatus;





import React, { useState, useEffect } from 'react';
import { Camera, Barcode, CircuitBoard, CheckCircle2 } from 'lucide-react';

const WorkflowStatus = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedStep, setCompletedStep] = useState(-1);
  
  const getStepColor = (stepIndex, currentStep, completedStep) => {
    if (stepIndex <= completedStep) return '#4CAF50';  // Green for completed
    if (stepIndex === currentStep) return '#FFC107';  // Yellow for processing
    if (stepIndex === currentStep && completedStep === stepIndex - 1) return '#f44336';  // Red for next
    return '#E5E7EB';  // Gray for pending
  };

  const steps = [
    { id: 0, title: 'Scan Barcode', icon: Barcode },
    { id: 1, title: 'Camera Scan', icon: Camera },
    { id: 2, title: 'Processing', icon: CircuitBoard },
    { id: 3, title: 'Results Ready', icon: CheckCircle2 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 3) {
          setCompletedStep(prev);
          return prev + 1;
        }
        setCompletedStep(-1);
        return 0;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-screen p-8 bg-gray-50">
      <div className="flex justify-between items-center relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center w-1/4 relative">
            {index < steps.length - 1 && (
              <div className="absolute h-0.5 w-full top-6 left-1/2">
                <div className={`h-full`}
                  style={{ 
                    backgroundColor: getStepColor(index, currentStep, completedStep),
                    transition: 'all 0.5s ease'
                  }}
                />
              </div>
            )}
            
            <div
              className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center 
                transition-all duration-500"
              style={{
                backgroundColor: getStepColor(index, currentStep, completedStep),
                boxShadow: currentStep === index ? '0 0 15px currentColor' : 'none',
                color: getStepColor(index, currentStep, completedStep)
              }}
            >
              <step.icon className="w-6 h-6 text-white" />
            </div>
            
            <span className={`mt-2 text-sm font-medium
              ${currentStep === index ? 'text-gray-800' : 'text-gray-500'}`}>
              {step.title}
            </span>
            
            {currentStep === index && (
              <div className="absolute z-0 w-12 h-12 rounded-full animate-ping opacity-25"
                style={{ backgroundColor: getStepColor(index, currentStep, completedStep) }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowStatus;
