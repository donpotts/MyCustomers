using FluentResults;
using MyCustomers.Application.Contracts;
using MyCustomers.Application.Contracts.Customers;
using MyCustomers.Application.Results;
using MyCustomers.Domain;
using MyCustomers.Domain.Customers;
using MyCustomers.Domain.Shared.Results;

namespace MyCustomers.Application.Customers;

/// <summary>
/// Application service for managing customers.
/// </summary>
public class CustomerAppService(
    IRepository<Customer, Guid> repository,
    IQueryService<Customer, Guid, CustomerDto> queryService,
    IUnitOfWork unitOfWork,
    IGuidGenerator guidGenerator,
    IMapper<Customer, CustomerDto> mapper
) : ICustomerAppService
{
    private readonly IRepository<Customer, Guid> _repository = repository;
    private readonly IQueryService<Customer, Guid, CustomerDto> _queryService = queryService;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IGuidGenerator _guidGenerator = guidGenerator;
    private readonly IMapper<Customer, CustomerDto> _mapper = mapper;

    /// <inheritdoc />
    public async Task<Result<CustomerDto>> GetAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var customerDto = await _queryService.GetByIdAsync(id, cancellationToken);

        if (customerDto is null)
        {
            return Result.Fail(
                new ResourceNotFoundError($"Customer with ID '{id}' was not found.")
            );
        }

        return Result.Ok(customerDto);
    }

    /// <inheritdoc />
    public async Task<Result<PageDto<CustomerDto>>> ListAsync(
        int? skip = null,
        int? take = null,
        CancellationToken cancellationToken = default
    )
    {
        var paginationResult = PaginationValidator.Validate(skip, take);

        if (paginationResult.IsFailed)
        {
            return paginationResult;
        }

        skip ??= 0;
        take ??= AppServiceConstants.DefaultPageSize;

        var totalCount = await _queryService.CountAsync(cancellationToken);
        var customerDtos = await _queryService.GetPageAsync(
            skip.Value,
            take.Value,
            cancellationToken: cancellationToken
        );
        var page = new PageDto<CustomerDto>(totalCount, customerDtos);
        return Result.Ok(page);
    }

    /// <inheritdoc />
    public async Task<Result<CustomerDto>> CreateAsync(
        CreateUpdateCustomerDto dto,
        CancellationToken cancellationToken = default
    )
    {
        var customerResult = Customer.Create(
            _guidGenerator.Create(),
            dto.Name,
            dto.Email,
            dto.Number,
            dto.Notes,
            dto.CreatedDate,
            dto.ModifiedDate
        );

        if (customerResult.IsFailed)
        {
            return customerResult.ToResult().MapErrorsToAppServiceResult();
        }

        await _repository.AddAsync(customerResult.Value, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Ok(_mapper.MapToDto(customerResult.Value));
    }

    /// <inheritdoc />
    public async Task<Result<CustomerDto>> UpdateAsync(
        Guid id,
        CreateUpdateCustomerDto dto,
        CancellationToken cancellationToken = default
    )
    {
        var customer = await _repository.GetByIdAsync(id, cancellationToken);

        if (customer is null)
        {
            return Result.Fail(
                new ResourceNotFoundError($"Customer with ID '{id}' was not found.")
            );
        }

        var nameResult = customer.UpdateName(dto.Name);
        var emailResult = customer.UpdateEmail(dto.Email);
        var numberResult = customer.UpdateNumber(dto.Number);
        var notesResult = customer.UpdateNotes(dto.Notes);
        var createdDateResult = customer.UpdateCreatedDate(dto.CreatedDate);
        var modifiedDateResult = customer.UpdateModifiedDate(dto.ModifiedDate);
        var mergedResult = Result.Merge(nameResult, emailResult, numberResult, notesResult, createdDateResult, modifiedDateResult);

        if (mergedResult.IsFailed)
        {
            return mergedResult.MapErrorsToAppServiceResult();
        }

        await _repository.UpdateAsync(customer, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Ok(_mapper.MapToDto(customer));
    }

    /// <inheritdoc />
    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await _repository.GetByIdAsync(id, cancellationToken);

        if (customer is null)
        {
            return Result.Fail(
                new ResourceNotFoundError($"Customer with ID '{id}' was not found.")
            );
        }

        await _repository.DeleteAsync(customer, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Ok();
    }
}
